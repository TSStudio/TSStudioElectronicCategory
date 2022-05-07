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
$uid=$_SESSION['uid'];
$data=$api->get_request();
// POST PARAMS
// category_name
require_once 'lib/db.php';
$conn=new mysqli($mysql_host,$mysql_user,$mysql_password,$mysql_db);
if($conn->connect_error){
    $api->throw_error(TAPI_ERR_INTERNAL,"Error connecting to database");
}
$category_name=$data['category_name'];
if(!$category_name){
    $api->throw_error(TAPI_ERR_MISSING_PARAM,"Missing category name");
}
// if empty
if(empty($category_name)){
    $api->throw_error(TAPI_ERR_MISSING_PARAM,"Missing category name");
}
$category_name=$conn->real_escape_string($category_name);
$sql="INSERT INTO category (user,name) VALUES ($uid,'$category_name')";
$result=$conn->query($sql);
if(!$result){
    $api->throw_error(TAPI_ERR_INTERNAL,"Error inserting category");
}
require_once 'lib/log4u.php';
$log4u=new log4u($mysql_host,$mysql_user,$mysql_password,$mysql_db);
$log4u->create_log($uid,"ADD CATEG ".$conn->insert_id." NAMING ".$category_name.".");
$api->response(array(
    'category_id'=>$conn->insert_id,
    'category_name'=>$category_name
));
$conn->close();
?>