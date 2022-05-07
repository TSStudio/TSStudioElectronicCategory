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
$uid=$_SESSION['uid'];
$cid=$_GET["cid"];
if(!$cid){
    $api->throw_error(TAPI_ERR_MISSING_PARAM,"Missing category id");
}
if($_SESSION['restricted']!=0){
    $api->throw_error(TAPI_ERR_RESTRICTED,"Not logged in");
    exit();
}
require_once 'lib/db.php';
$conn=new mysqli($mysql_host,$mysql_user,$mysql_password,$mysql_db);
if($conn->connect_error){
    $api->throw_error(TAPI_ERR_INTERNAL,"Error connecting to database");
}
$cid=$conn->real_escape_string($cid);
$sql="DELETE FROM category WHERE cid=".$cid." AND user=".$uid;
$result=$conn->query($sql);
if(!$result){
    $api->throw_error(TAPI_ERR_INTERNAL,"Error deleting category");
}
//CHECK IF AFFECTED ROWS IS 1
if($conn->affected_rows!=1){
    $api->throw_error(TAPI_ERR_INTERNAL,"Not your category or category not found");
}
$sql="DELETE FROM list2 WHERE category=".$cid." AND uid=".$uid.";";
$result=$conn->query($sql);
if(!$result){
    $api->throw_error(TAPI_ERR_INTERNAL,"Error deleting list");
}
require_once 'lib/log4u.php';
$log4u=new log4u($mysql_host,$mysql_user,$mysql_password,$mysql_db);
$log4u->create_log($uid,"DEL CATEG ".$cid." AND ITS ITEMS.");
$conn->close();
$api->response(array());
?>