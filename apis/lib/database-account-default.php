<?
/*
使用方法：

一、将apis/下的每一个文件中的以下部分：

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

替换为你自己想用的用户登录方式，并设置变量 $uid.

二、将此文件下面的部分设置为你自己的数据库，并更改此文件名为 db.php

三、导入此目录下的几个sql文件。

四、修改 js 文件中的api地址。

五、使用webpack打包js。
*/
$mysql_host="127.0.0.1";
$mysql_user="";
$mysql_password="";
$mysql_db="";