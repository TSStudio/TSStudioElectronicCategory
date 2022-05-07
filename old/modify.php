<html>
    <head><link rel="stylesheet" href="css/style.css"></head>
    <body>
        <a href="<?=$_GET["from"]?>" class="btn">返回</a>
<?php
session_start();
if($_SESSION['uid']!=6){
    echo "没有权限";
    exit();
}
//check if post id
if(!isset($_GET['id'])){
    exit();
}
require_once('db.php');
//connect to mysqli
$conn=mysqli_connect($mysql_host,$mysql_user,$mysql_password,$mysql_db);
// TABLE: list
//check if is in
$id=$_GET['id'];
//prevent sql injection
$id=mysqli_real_escape_string($conn,$id);
$sql="SELECT * FROM list WHERE uniqueID=$id LIMIT 1";
$result=mysqli_query($conn,$sql);
if(mysqli_num_rows($result)==0){
    exit();
}
$row=$result->fetch_array();
// print to table(input boxes)
echo "<form action=\"modify2.php?from=".urlencode($_GET["from"])."\" method=\"post\">";
echo "<input type='hidden' name='id' value='".$id."'>";
echo "<table border='1'><tr><th>立创商城ID</th><th>库存</th><th>封装</th><th>值</th><th>具体类别</th><th>条码</th><th>修改</th></tr>";
echo "<tr>";
echo "<td><input type='text' name='lcscid' value='".$row[2]."' class='inp120'></td>";
echo "<td><input type='text' name='remaining' value='".$row[3]."' class='inp50'></td>";
echo "<td><input type='text' name='package' value='".$row[4]."' class='inp120'></td>";
echo "<td><input type='text' name='value' value='".$row[5]."' class='inp50'></td>";
echo "<td><input type='text' name='specificType' value='".$row[6]."' class='inp200'></td>";
echo "<td><input type='text' name='barcode' value='".$row[7]."' class='inp200'></td>";
echo "<td><input type='submit' value='修改' class=\"btn-slim\"></td>";
echo "</tr></table>";
echo "</form>";
?>
    </body>
</html>