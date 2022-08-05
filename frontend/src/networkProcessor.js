window.AJAXPostRequest=function(url,content,callback){
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
window.AJAXGetRequest=function(url,content,callback){
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
window.getCategories=function(){
    AJAXGetRequest("apis/getCategoryList.php","",CategoryResolver);
}
window.getLog=function(){
    AJAXGetRequest("apis/getLog.php","",LogResolver);
}
window.getDetailedCategories=function(optional=0){
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
window.timeparse=function(unix_timestamp){
    //to YYYY-MM-DD HH:MM:SS
    var date = new Date(unix_timestamp*1000);
    return date.format("yyyy-MM-dd hh:mm:ss");
}
window.LogResolver=function(json_data){
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
window.CategoryResolver=function(json_data){
    categories=["全部"];
    category_ids=[-1];
    json_resolved=JSON.parse(json_data);
    for(let i=0;i<json_resolved.categories.length;i++){
        categories.push(json_resolved.categories[i].category_name);
        category_ids.push(json_resolved.categories[i].category_id);
    }
    currentCategory=0;
    refreshCategories();
    getpage(1);
}
window.DetailedCategoryResolver=function(json_data){
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
}
window.deleteCategory=function(cid){
    c=confirm("你确定要删除此类别吗？所有属于此类别的零件都将消失。该操作不可逆。");
    if(!c){
        return;
    }
    //check if numberic
    if(isNaN(cid)){
        console.log("NAN.");
        return;
    }
    AJAXGetRequest("apis/deleteCategory.php?cid="+cid.toString(),"",function(){getDetailedCategories();getCategories();});
}
window.ExceptionHandler=function(json_resolved){
    console.log(json_resolved);
    setLoadingBar(100,1);
    windowO=openWindow();
    if(json_resolved.error==1){
        windowO.innerHTML='<div id="wtitle"><div id="wtitle-left">出错啦！</div></div>你似乎没有登录。<br><a href="https://account.tmysam.top/" class="SmallButton">此处登录</a><br>错误代码：'+json_resolved.error+'<br>来自服务器的信息：<br>'+json_resolved.errmsg;
    }else{
        windowO.innerHTML='<div id="wtitle"><div id="wtitle-left">出错啦！</div><div id="wtitle-right"><i class="iconfont mid-icon closer" onclick="confirm(\'你确定要忽略这个错误吗？\')?closeWindow():false">&#xe670;</i></div></div>错误代码：'+json_resolved.error+'<br>来自服务器的信息：<br>'+json_resolved.errmsg;
    }
}
window.newCategory=function(name){
    AJAXPostRequest("apis/newCategory.php",JSON.stringify({"category_name":name}),function(){getDetailedCategories();getCategories();});
}
window.getPartInfo=function(pid){
    AJAXGetRequest("apis/getPartInfo.php?pid="+pid.toString(),"",getPartInfoResolver);
}
window.getPartInfoResolver=function(json_data){
    json_resolved=JSON.parse(json_data);
    document.getElementById("remaining").value=json_resolved.remaining;
    document.getElementById("name").value=json_resolved.name;
    document.getElementById("selfId").value=json_resolved.selfId;
    document.getElementById("value").value=json_resolved.value;
    document.getElementById("barcode").value=json_resolved.barcode;
}
var _paq = window._paq = window._paq || [];
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
    var u="//security.tmysam.top/matomo/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '1']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();