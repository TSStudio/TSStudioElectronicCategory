<html>
    <head><link rel="stylesheet" href="css/style.css"></head>
    <body style="color:white;">
        <a href="<?="modify.php?id=$id&from=".urlencode($_GET["from"])?>" class="btn">返回</a>
<?php 
session_start();
if($_SESSION['uid']!=6){
    echo "没有权限";
    exit();
}
require_once('db.php');
//connect to mysqli
$conn=mysqli_connect($mysql_host,$mysql_user,$mysql_password,$mysql_db);
//update in table `list` where id = _POST['id']
// column `lcscid`, `remaining`, `package`, `value`, `specificType`
$id=intval($_POST['id']);
$lcscid=$_POST['lcscid'];
$remaining=intval($_POST['remaining']);
$package=$_POST['package'];
$value=$_POST['value'];
$specificType=$_POST['specificType'];
$barcode=$_POST['barcode'];
// prevent injection
$id=mysqli_real_escape_string($conn,$id);
$lcscid=mysqli_real_escape_string($conn,$lcscid);
$remaining=mysqli_real_escape_string($conn,$remaining);
$package=mysqli_real_escape_string($conn,$package);
$value=mysqli_real_escape_string($conn,$value);
$specificType=mysqli_real_escape_string($conn,$specificType);
$barcode=mysqli_real_escape_string($conn,$barcode);
$sql="UPDATE list SET lcscid='$lcscid',remaining=$remaining,package='$package',value=$value,specificType='$specificType',barcode=$barcode WHERE uniqueID=$id";
$result=mysqli_query($conn,$sql);
if($result){
    echo "修改成功";
}else{
    echo "修改失败";
}
// save log in table log
// columns `id`(A.I.), `info`, `time`
$info="E".$id.".".$lcscid.".".$remaining.".".$package.".".$value.".".$specificType.".".$barcode;
$time=time();
$sql="INSERT INTO log (info,time) VALUES ('$info',$time)";
$result=mysqli_query($conn,$sql);
// wait 3 sec and go to modify.php?id=$id
header("refresh:1;url=modify.php?id=$id&from=".urlencode($_GET["from"]));
?>
    </body>
</html>