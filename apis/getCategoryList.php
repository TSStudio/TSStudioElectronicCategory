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
if($_SESSION['restricted']!=0){
    $api->throw_error(TAPI_ERR_RESTRICTED,"Not logged in");
    exit();
}
// GET, no PARAM
require_once 'lib/db.php';
$conn=new mysqli($mysql_host,$mysql_user,$mysql_password,$mysql_db);
if($conn->connect_error){
    $api->throw_error(TAPI_ERR_INTERNAL,"Error connecting to database");
}
$sql="SELECT * FROM category WHERE user=$uid";
$result=$conn->query($sql);
if(!$result){
    $api->throw_error(TAPI_ERR_INTERNAL,"Error querying categories");
}
$categories=array();
while($row=$result->fetch_assoc()){
    $categories[]=array(
        'category_id'=>$row['cid'],
        'category_name'=>$row['name']
    );
}
$conn->close();
$api->response(array("categories"=>$categories));
?>