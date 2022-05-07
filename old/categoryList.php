<?php 
session_start();
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
        return $content.'u';
    }
    if($content>=0.000000001){
        $content=$content*1000000000;
        return $content.'p';
    }
    if($content>=0.000000000001){
        $content=$content*1000000000000;
        return $content.'n';
    }
}
// <a href="categoryList.php?type=0">电阻</a><br>
// <a href="categoryList.php?type=1">电容</a><br>
// <a href="categoryList.php?type=2">电感</a><br>
// <a href="categoryList.php?type=3">二极管</a><br>
// <a href="categoryList.php?type=4">电源芯片</a><br>
// <a href="categoryList.php?type=5">其他芯片</a><br>
// <a href="categoryList.php?type=6">PCB板</a><br>
// <a href="categoryList.php?type=7">排针/排母</a><br>

$typelist=array("电阻","电容","电感","二极管","电源芯片","其他芯片","PCB板","排针/排母","三极管","其他器件");

require_once('db.php');
//connect to mysqli
$conn=mysqli_connect($mysql_host,$mysql_user,$mysql_password,$mysql_db);
// TABLE: list
$type=$_GET['type'];
// COLUMNS: type	uniqueID	lcscid	remaining	package	value	specificType	
$columnList=array("type","uniqueID","lcscid","remaining","package","value","specificType");
$page=isset($_GET['page'])?$_GET['page']:1;
$sorting=isset($_GET['sorting'])?$_GET['sorting']:1;
$orderList=array("desc","asc");
$order=isset($_GET['order'])?$_GET['order']:1;//0 for desc, 1 for asc
if($order!=0&&$order!=1){
    $order=0;
}
$page_size=20;
$offset=($page-1)*$page_size;
// get count in this type
if($type!=-1){
    $sql="SELECT COUNT(*) FROM list WHERE type=$type";
}else{
    $sql="SELECT COUNT(*) FROM list";
}
$result=$conn->query($sql);
$row=$result->fetch_array();
$count=$row[0];
// if count=0 goto last
$titlelist=array("类别","唯一ID","立创商城ID","库存","封装","值","具体类别");
$output="";
$output.="<form action=\"add.php\" method=\"post\"><table><tr>";
for($i=0;$i<=6;$i++){
    if($i==$sorting){
        $symbol=$order?"▲":"▼";
        $output.="<td><a href=\"categoryList.php?type=$type&page=1&sorting=$i&order=".(1-$order)."\" class=\"tha\">".$titlelist[$i].$symbol."</a></td>";
    }else{
        $output.="<th><a href=\"categoryList.php?type=$type&page=1&sorting=$i&order=0\" class=\"tha\">".$titlelist[$i]."</a></th>";
    }
}
if(!isset($_SESSION['uid'])||$_SESSION['uid']!=6){
    $output.="</tr>";
}else{
    $output.="<th>修改</th></tr>";
}

if($count==0){
    goto last;
}
$total_page=ceil($count/$page_size);
// if page is out of range, redirect to last page
if($page>$total_page||$page<1){
    header("Location: categoryList.php?type=$type&page=$total_page");
}
if($type!=-1){
    $sql="SELECT * FROM list WHERE type=$type ORDER BY ".$columnList[$sorting]." ".$orderList[$order]." LIMIT $offset,$page_size";
}else{
    $sql="SELECT * FROM list ORDER BY ".$columnList[$sorting]." ".$orderList[$order]." LIMIT $offset,$page_size";
}
$result=$conn->query($sql);
// title list

while($row=$result->fetch_array()){
    $output.="<tr>";
    $output.="<td class='th0'>".$typelist[$row[0]]."</td>";
    $output.="<td class='th1'>".$row[1]."</td>";
    $output.="<td class='th2'>$row[2]</td>";
    $output.="<td class='th3'>$row[3]</td>";
    $output.="<td class='th4'>$row[4]</td>";
    $output.="<td class='th5'>".value_double_to_symbol($row[5])."</td>";
    $output.="<td class='th6'>".$row[6]."</td>";
    $url=urlencode($_SERVER["REQUEST_URI"]);
    if(isset($_SESSION['uid'])&&$_SESSION['uid']==6){
        $output.="<td><a href=\"modify.php?id=".$row[1]."&from=".$url."\" class=\"btn-slim\">修改</td>";
    }
    $output.="</tr>";
}
// print a row with all input boxes
last:
if($type!=-1&&isset($_SESSION['uid'])&&$_SESSION['uid']==6){
    $output.="<tr>";
    $output.="<td>新 <input type='text' name='type' value='".$type."' class='inp50'></td>";
    $output.="<td>ID将自动生成</td>";
    $output.="<td><input type='text' name='lcscid' class='inp120'></td>";
    $output.="<td><input type='text' name='remaining' class='inp50'></td>";
    $output.="<td><input type='text' name='package' class='inp120'></td>";
    $output.="<td><input type='text' name='value' class='inp50'></td>";
    $output.="<td><input type='text' name='specificType' class='inp200'></td>";
    $output.="<td><input type='submit' value='提交' class='btn-slim'></td>";
    $output.="</tr>";
}
$output.="</table>";
if($count!=0){
    //page switching bar
    $output.="<div style='text-align:center;' class='pages'>";
    if($page!=1){
        $output.="<a href='categoryList.php?type=$type&page=1' class='btn-slim'>首页</a>";
        $output.="<a href='categoryList.php?type=$type&page=".($page-1)."' class='btn-slim'>上一页</a>";
    }
    $output.=" 第".$page."页/共".$total_page."页(共".$count."条)";
    if($page<$total_page){
        $output.="<a href='categoryList.php?type=$type&page=".($page+1)."' class='btn-slim'>下一页</a>";
        $output.="<a href='categoryList.php?type=$type&page=$total_page' class='btn-slim'>尾页</a>";
    }
    $output.="</div>";
}
?>
<html>
    <head>
        <link rel="stylesheet" href="css/style.css">
        <?php 
        if($count!=0){
            if($page!=1){
                echo'<link rel="prefetch" href="categoryList.php?type=$type&page='.($page-1).'">';
                echo'<link rel="prerender" href="categoryList.php?type=$type&page='.($page-1).'">';
            }
            if($page<$total_page){
                echo'<link rel="prefetch" href="categoryList.php?type=$type&page='.($page-1).'">';
                echo'<link rel="prerender" href="categoryList.php?type=$type&page='.($page+1).'">';
            }
        }
        ?>
    </head>

    <body>
        <a href="index.html" class="btn">返回</a>
        <?=$output?>
</body>
</html>