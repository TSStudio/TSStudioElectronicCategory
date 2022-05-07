<?php 
// echo "<td><input type='text' name='uniqueID'></td>";
// echo "<td><input type='text' name='lcscid'></td>";
// echo "<td><input type='text' name='remaining'></td>";
// echo "<td><input type='text' name='package'></td>";
// echo "<td><input type='text' name='value'></td>";
// echo "<td><input type='text' name='specificType'></td>";
// POST type,lcscid,remaining,package,value,specificType
session_start();
if($_SESSION['uid']!=6){
    echo "没有权限";
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
require_once('db.php');
//connect to mysqli
$conn=mysqli_connect($mysql_host,$mysql_user,$mysql_password,$mysql_db);
// insert to TABLE: list
// COLUMNS: type	uniqueID(A.I.)	lcscid	remaining	package	value	specificType	
$type=intval($_POST['type']);
$lcscid=$_POST['lcscid'];
//to int
$remaining=intval($_POST['remaining']);
$package=$_POST['package'];
$value=value_symbol_to_double($_POST['value']);
$specificType=$_POST['specificType'];
//prevent injection
$type=mysqli_real_escape_string($conn,$type);
$lcscid=mysqli_real_escape_string($conn,$lcscid);
$remaining=mysqli_real_escape_string($conn,$remaining);
$package=mysqli_real_escape_string($conn,$package);
$value=mysqli_real_escape_string($conn,$value);
$specificType=mysqli_real_escape_string($conn,$specificType);
$sql="INSERT INTO list (type,lcscid,remaining,package,value,specificType) VALUES ('$type','$lcscid',$remaining,'$package',$value,'$specificType')";
//goback to categoryList.php?type=$type
$result=$conn->query($sql);
print $conn->error;
$info="A.".$lcscid.".".$remaining.".".$package.".".$value.".".$specificType;
$time=time();
$sql="INSERT INTO log (info,time) VALUES ('$info',$time)";
$result=mysqli_query($conn,$sql);
header("Location: categoryList.php?type=$type");
?>