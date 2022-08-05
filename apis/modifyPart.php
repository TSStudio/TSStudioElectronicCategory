<?php
session_start();
require_once 'lib/tapilib.php';
$api=new Tapi();
if(!isset($_SESSION['uid'])){
    require_once "lib/authkeeper.php";
    require_once "lib/database-account.php";
    $authkeeper = new TAuthKeeper($mysql_host,$mysql_user,$mysql_password,$mysql_db);
    $uid=$authkeeper->check_keep_token();
    if($uid===false){
        $api->throw_error(TAPI_ERR_NOT_LOGGED_IN,"Not logged in");
        exit();
    }else{
        $_SESSION['uid']=$uid;
        $restricted=$authkeeper->check_restricted($uid);
        if($restricted==-1){
            $api->throw_error(TAPI_ERR_NOT_LOGGED_IN,"Not logged in");
            exit();
        }
        if($restricted==1){
            $_SESSION['restricted']=1;
        }else{
            $_SESSION['restricted']=0;
        }
    }
}
if($_SESSION['restricted']!=0){
    $api->throw_error(TAPI_ERR_RESTRICTED,"Not logged in");
    exit();
}
function value_symbol_to_double($content){
    //convert to lower
    $content=strtolower($content);
    //if end with 'k'
    if(substr($content,-1)=='k'){
        $content=substr($content,0,-1);
        $content=$content*1000;
    }
    //if end with 'm'
    if(substr($content,-1)=='m'){
        $content=substr($content,0,-1);
        $content=$content/1000;
    }
    //if ends with 'u'
    if(substr($content,-1)=='u'){
        $content=substr($content,0,-1);
        $content=$content/1000000;
    }
    //if ends with 'p'
    if(substr($content,-1)=='p'){
        $content=substr($content,0,-1);
        $content=$content/1000000000;
    }
    //if ends with 'n'
    if(substr($content,-1)=='n'){
        $content=substr($content,0,-1);
        $content=$content/1000000000000;
    }
    return $content;
}

$uid=$_SESSION['uid'];
$data=$api->get_request();
require_once 'lib/db.php';
$conn=new mysqli($mysql_host,$mysql_user,$mysql_password,$mysql_db);
if($conn->connect_error){
    $api->throw_error(TAPI_ERR_INTERNAL,"Error connecting to database");
}
// TABLE list2
// COLS  pid(A.I)	category	remaining	name	uid	selfId	value	barcode
// POST PARAMS
// category,remaining,name,selfId,value,barcode
$pid=$data['pid'];
$remaining=$data['remaining'];
$name=$data['name'];
$selfId=$data['selfId'];
$value=$data['value'];
$barcode=$data['barcode'];
// if any is empty
if(strlen($selfId)==0){$selfId="0";}
if(strlen($barcode)==0){$barcode="0";}
if(empty($pid)||strlen($name)==0||strlen($selfId)==0||strlen($barcode)==0){
    $api->throw_error(TAPI_ERR_INVALID_INPUT,"Invalid parameters");
}
// prevent sql injection
$pid=$conn->real_escape_string($pid);
$remaining=$conn->real_escape_string($remaining);
$name=$conn->real_escape_string($name);
$selfId=$conn->real_escape_string($selfId);
$value=$conn->real_escape_string(value_symbol_to_double($value));
$barcode=$conn->real_escape_string($barcode);

$sql="UPDATE list2 SET remaining=$remaining,name='$name',selfId='$selfId',value=$value,barcode='$barcode' WHERE pid=$pid AND uid=$uid";
$result=$conn->query($sql);
// AFFECTED ROWS=0 , throw_error
if($conn->affected_rows==0){
    $api->throw_error(TAPI_ERR_INVALID_INPUT,"Invalid parameters, affected 0 rows");
}
require_once 'lib/log4u.php';
$log4u=new log4u($mysql_host,$mysql_user,$mysql_password,$mysql_db);
$log4u->create_log($uid,"MODP,R='$remaining',N='$name',s='$selfId',v='$value',b='$barcode' W p='$pid'");
$api->response(array());
$conn->close();
?>