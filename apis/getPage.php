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
$data=$api->get_request();
if($_SESSION['restricted']!=0){
    $api->throw_error(TAPI_ERR_RESTRICTED,"Not logged in");
    exit();
}
// POST
require_once 'lib/db.php';
$conn=new mysqli($mysql_host,$mysql_user,$mysql_password,$mysql_db);
if($conn->connect_error){
    $api->throw_error(TAPI_ERR_INTERNAL,"Error connecting to database");
}
// category, page, sortingby, sorting
$category=$data['category'];
$page=$data['page'];
$sortingby=$data['sortingby'];
$sorting=$data['sorting'];
// prevent sql injection
$sortingList=["pid","remaining","name","selfId","value"];
$category=$conn->real_escape_string($category);
$page=$conn->real_escape_string($page);
$sortingby=$conn->real_escape_string($sortingList[$sortingby]);
$sorting=$conn->real_escape_string($sorting);
// sorting must be ASC or DESC
if($sorting!='ASC'&&$sorting!='DESC'){
    $api->throw_error(TAPI_ERR_INVALID_INPUT,"Invalid sorting");
    exit();
}
//pid	remaining	name	selfId	value

$sql="SELECT * FROM category WHERE user='$uid' AND cid='$category' LIMIT 1";
//check if there is result
if($category!=-1){
    $result=$conn->query($sql);
    if($result->num_rows==0){
        $api->throw_error(TAPI_ERR_INVALID_INPUT,"Category does not exist or not owned by you");
    }
}
// get total number of items
// if category is -1, then all categories
if($category==-1){
    $sql="SELECT COUNT(*) FROM list2";
}else{
    $sql="SELECT COUNT(*) FROM list2 WHERE category=$category";
}
$result=$conn->query($sql);
$row=$result->fetch_row();
$total=$row[0];
// 10 per page
$perPage=10;
// get total number of pages
$totalPage=ceil($total/$perPage);
if($totalPage==0){
    $totalPage=1;
}
// get current page
if($page>$totalPage){
    $page=$totalPage;
}
if($page<1){
    $page=1;
}
// get start and end
$start=($page-1)*$perPage;
$end=$start+$perPage;
// get items
if($category==-1){
    $sql="SELECT * FROM list2 ORDER BY $sortingby $sorting LIMIT $start,$end";
}else{
    $sql="SELECT * FROM list2 WHERE category=$category ORDER BY $sortingby $sorting LIMIT $start,$end";
}
$result=$conn->query($sql);
$items=array();
while($row=$result->fetch_assoc()){
    $items[]=$row;
}
for($i=0;$i<count($items);$i++){
    $items[$i]['value']=value_double_to_symbol($items[$i]['value']);
}
$conn->close();
$api->response(array("total"=>$total,"page"=>$page,"totalPage"=>$totalPage,"items"=>$items));
?>