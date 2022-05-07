function AJAXPostRequest(url,content,callback){
    setLoadingBar(20);
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==1){
            setLoadingBar(30);
        }
        if (xmlhttp.readyState==2){
            setLoadingBar(40);
        }
        if (xmlhttp.readyState==3){
            setLoadingBar(60);
        }
        if (xmlhttp.readyState==4){
            setLoadingBar(100);
            if(xmlhttp.status==200){
                json_resolved=JSON.parse(xmlhttp.responseText);
                if(json_resolved.error!=0){
                    ExceptionHandler(json_resolved);
                    return;
                }
                callback(xmlhttp.responseText);
            }
        }
    }
    //json content
    xmlhttp.open("POST",url,true);
    xmlhttp.setRequestHeader("Content-type","application/json");
    xmlhttp.send(content);
}
function AJAXGetRequest(url,content,callback){
    setLoadingBar(20);
    xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==1){
            setLoadingBar(30);
        }
        if (xmlhttp.readyState==2){
            setLoadingBar(40);
        }
        if (xmlhttp.readyState==3){
            setLoadingBar(60);
        }
        if (xmlhttp.readyState==4){
            setLoadingBar(100);
            if(xmlhttp.status==200){
                json_resolved=JSON.parse(xmlhttp.responseText);
                if(json_resolved.error!=0){
                    ExceptionHandler(json_resolved);
                    return;
                }
                callback(xmlhttp.responseText);
            }
        }
    }
    //json content
    xmlhttp.open("GET",url,true);
    xmlhttp.setRequestHeader("Content-type","x-www-form-urlencoded");
    xmlhttp.send();
}
function getCategories(){
    AJAXGetRequest("apis/getCategoryList.php","",CategoryResolver);
}
function getLog(){
    AJAXGetRequest("apis/getLog.php","",LogResolver);
}
function getDetailedCategories(optional=0){
    AJAXGetRequest("apis/getDetailedCategoryList.php","",DetailedCategoryResolver);
}
Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
} 
function timeparse(unix_timestamp){
    //to YYYY-MM-DD HH:MM:SS
    var date = new Date(unix_timestamp*1000);
    return date.format("yyyy-MM-dd hh:mm:ss");
}
function LogResolver(json_data){
    json_resolved=JSON.parse(json_data);
    if(json_resolved.error!=0){
        ExceptionHandler(json_resolved);
        return;
    }
    json_logs=json_resolved.logs;
    container=document.getElementById("logContainer");
    str="";
    for(let i=0;i<json_logs.length;i++){
        // html encode
        item="["+timeparse(json_logs[i].time)+"] "+json_logs[i].data;
        str+="<div class=\"managerCategory logtext\">"+item+"</div>";
    }
    container.innerHTML=str;
}
function CategoryResolver(json_data){
    categories=["全部"];
    category_ids=[-1];
    json_resolved=JSON.parse(json_data);
    for(let i=0;i<json_resolved.categories.length;i++){
        categories.push(json_resolved.categories[i].category_name);
        category_ids.push(json_resolved.categories[i].category_id);
    }
    currentCategory=0;
    refreshCategories();
}
function DetailedCategoryResolver(json_data){
    categories=["全部"];
    category_ids=[-1];
    json_resolved=JSON.parse(json_data);
    for(let i=0;i<json_resolved.categories.length;i++){
        categories.push(json_resolved.categories[i].category_name);
        category_ids.push(json_resolved.categories[i].category_id);
    }
    managerCategoryContainer=document.getElementById("managerCategoryContainer");
    str="";
    for(let i=0;i<json_resolved.categories.length;i++){
        str=str+'<div class="managerCategory"><div class="managerCategory-left">'+json_resolved.categories[i].category_name+' <div class="partNumShow"><a class="PartNumBig">'+json_resolved.categories[i].category_count.toString()+'</a><br>种零件</div></div><div class="managerCategory-right"><div class="vertLine"> </div><i class="iconfont large-icon clickable" onclick="deleteCategory('+json_resolved.categories[i].category_id+')">&#xe699;</i></div></div>';
    }
    managerCategoryContainer.innerHTML=str;
    getCategories()
}
function deleteCategory(cid){
    c=confirm("你确定要删除此类别吗？所有属于此类别的零件都将消失。该操作不可逆。");
    if(!c){
        return;
    }
    //check if numberic
    if(isNaN(cid)){
        console.log("NAN.");
        return;
    }
    AJAXGetRequest("apis/deleteCategory.php?cid="+cid.toString(),"",getDetailedCategories);
}
function ExceptionHandler(json_resolved){
    console.log(json_resolved);
    setLoadingBar(100,1);
}
function newCategory(name){
    AJAXPostRequest("apis/newCategory.php",JSON.stringify({"category_name":name}),getDetailedCategories);
}