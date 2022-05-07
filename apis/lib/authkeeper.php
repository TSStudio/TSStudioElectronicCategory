<?php
class TAuthKeeper{
    private $mysql_host;
    private $mysql_user;
    private $mysql_password;
    private $mysql_db;
    function __construct($mysql_host, $mysql_user, $mysql_password, $mysql_db){
        $this->mysql_host = $mysql_host;
        $this->mysql_user = $mysql_user;
        $this->mysql_password = $mysql_password;
        $this->mysql_db = $mysql_db;
    }
    public function generate_keep_token($uid){
        $conn = new mysqli($this->mysql_host, $this->mysql_user, $this->mysql_password, $this->mysql_db);
        // table tauth_keep
        // columns 	keepid	uid	time	sha256	
        // keepid: autoincrement
        // uid: uid
        // time: time()
        // sha256: sha256(keepid . (string)uid . (string)time)
        // keepid is autoincrement, so keep sha256 empty first
        $time=time();
        $sql = "INSERT INTO tauth_keep (uid, time) VALUES ($uid,$time)";
        $conn->query($sql);
        $keepid = $conn->insert_id;
        // sum sha256
        $sha256=hash('SHA256', $keepid . $uid . $time);
        // update sha256
        $sql = "UPDATE tauth_keep SET sha256='$sha256' WHERE keepid=$keepid";
        $conn->query($sql);
        // delete rows where time is more than 30 days ago
        $sql = "DELETE FROM tauth_keep WHERE time<".($time-2592000);
        $conn->query($sql);
        // close connection
        $conn->close();
        // set cookie
        setcookie("keep", $sha256, time()+2592000, "/");
        return $sha256;
    }
    public function check_keep_token(){
        // get cookie
        if(!isset($_COOKIE['keep'])){
            return false;
        }
        $sha256 = $_COOKIE['keep'];
        $conn = new mysqli($this->mysql_host, $this->mysql_user, $this->mysql_password, $this->mysql_db);
        // table tauth_keep
        // columns 	keepid	uid	time	sha256
        $result=$conn->query("SELECT uid,time,keepid FROM tauth_keep WHERE sha256='$sha256'");
        // check if exists
        if($result->num_rows==0){
            $conn->close();
            return false;
        }
        // get uid and time
        $row=$result->fetch_assoc();
        $uid=$row['uid'];
        $time=$row['time'];
        $keepid=$row['keepid'];
        $sql = "DELETE FROM tauth_keep WHERE keepid=$keepid";
        $conn->query($sql);
        // if more than 30 days ago
        if(time()-$time>2592000){
            $conn->close();
            return false;
        }
        // generate a new keep token
        $this->generate_keep_token($uid);
        return $uid;
    }
    public function check_restricted($uid){
        $conn = new mysqli($this->mysql_host, $this->mysql_user, $this->mysql_password, $this->mysql_db);
        $result=$conn->query("SELECT restricted FROM users WHERE uid=$uid");
        if($result->num_rows==0){
            $conn->close();
            return -1;
        }
        $row=$result->fetch_assoc();
        $conn->close();
        return $row['restricted'];
    }
    public function destroy($uid){
        // delete cookie: keep
        setcookie("keep", "", time()-1, "/");
        // delete all rows in tauth_keep where uid=$uid
        $conn = new mysqli($this->mysql_host, $this->mysql_user, $this->mysql_password, $this->mysql_db);
        $sql = "DELETE FROM tauth_keep WHERE uid=$uid";
        $conn->query($sql);
        $conn->close();
        return true;
    }
}