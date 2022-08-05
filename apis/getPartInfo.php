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
function value_double_to_symbol($content){
    if($content>=1000){
        $content=$content/1000;
        return $content.'k';
    }
    if($content>=1){
        return $content;
    }
    if($content>=0.001){
        $content=$content*1000;
        return $content.'m';
    }
    if($content>=0.000001){
        $content=$content*1000000;
        return $content.'μ';
    }
    if($content>=0.000000001){
        $content=$content*1000000000;
        return $content.'p';
    }
    if($content>=0.000000000001){
        $content=$content*1000000000000;
        return $content.'n';
    }
    return 0;
}
$uid=$_SESSION['uid'];
if($_SESSION['restricted']!=0){
    $api->throw_error(TAPI_ERR_RESTRICTED,"Not logged in");
    exit();
}
// GET PARAM pid
if(!isset($_GET['pid'])){
    $api->throw_error(TAPI_ERR_MISSING_PARAM,"Missing parameter: pid");
}
$pid=$_GET['pid'];
require_once 'lib/db.php';
$conn=new mysqli($mysql_host,$mysql_user,$mysql_password,$mysql_db);
if($conn->connect_error){
    $api->throw_error(TAPI_ERR_INTERNAL,"Error connecting to database");
}
$pid=$conn->real_escape_string($pid);
$sql="SELECT * FROM list2 WHERE pid=".$pid." AND uid=".$uid;
$result=$conn->query($sql);
if($result->num_rows==0){
    $api->throw_error(TAPI_ERR_INVALID_INPUT,"Part not found or not your part.");
}
$row=$result->fetch_assoc();
$conn->close();
$res=array();
$res['pid']=$row['pid'];
//pid	remaining	name	selfId	value barcode
$res['remaining']=$row['remaining'];
$res['name']=$row['name'];
$res['selfId']=$row['selfId'];
$res['value']=$row['value'];
$res['barcode']=$row['barcode'];
$api->response($res);
?>