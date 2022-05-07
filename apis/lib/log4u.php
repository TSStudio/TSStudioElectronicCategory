<?php 
class log4u{
    private $mysql_host;
    private $mysql_user;
    private $mysql_password;
    private $mysql_db;
    public function __construct($mysql_host,$mysql_user,$mysql_password,$mysql_db){
        $this->mysql_host=$mysql_host;
        $this->mysql_user=$mysql_user;
        $this->mysql_password=$mysql_password;
        $this->mysql_db=$mysql_db;
    }
    public function create_log($uid,$operation){
        $conn=new mysqli($this->mysql_host,$this->mysql_user,$this->mysql_password,$this->mysql_db);
        if($conn->connect_error){
            return false;
        }
        $operation=$conn->real_escape_string($operation);
        $uid=$conn->real_escape_string($uid);
        $time=time();
        $sql="INSERT INTO log2 (uid,time,data) VALUES (".$uid.",".$time.",'".$operation."')";
        $result=$conn->query($sql);
        if(!$result){
            return false;
        }
        $conn->close();
        return true;
    }
    public function get_logs($uid,$limit){
        $conn=new mysqli($this->mysql_host,$this->mysql_user,$this->mysql_password,$this->mysql_db);
        if($conn->connect_error){
            return false;
        }
        $uid=$conn->real_escape_string($uid);
        $limit=$conn->real_escape_string($limit);
        $sql="SELECT * FROM log2 WHERE uid=".$uid." ORDER BY time DESC LIMIT ".$limit;
        $result=$conn->query($sql);
        if(!$result){
            return false;
        }
        $logs=array();
        while($row=$result->fetch_assoc()){
            $logs[]=array(
                'time'=>$row['time'],
                'data'=>$row['data']
            );
        }
        $conn->close();
        return $logs;
    }
}