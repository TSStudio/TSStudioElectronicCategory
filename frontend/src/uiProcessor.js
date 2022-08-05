var isLoadingBarVisible = false;
var timeoutID=0;
window.setLoadingBar=function(percentage,error=0){
    if(error){
        isLoadingBarVisible = true;
        try{window.clearTimeout(timeoutID);}catch(e){}
        document.getElementById("loading-bar").style.height = "5px";
        document.getElementById("loading-bar").style.width = "100%";
        document.getElementById("loading-bar").style.backgroundColor = "#FF5A5A";
        return;
    }
    document.getElementById("loading-bar").style.backgroundColor = "#3dc8ff";
    if(percentage==100||percentage==0){
        document.getElementById("loading-bar").style.height = "0px";
        isLoadingBarVisible = false;
        if(percentage==100){
            timeoutID=setTimeout("setLoadingBar(0)",200);
        }
    }else if(!isLoadingBarVisible){
        isLoadingBarVisible = true;
        document.getElementById("loading-bar").style.height = "3px";
    }
    //edit width style of id loading-bar
    document.getElementById("loading-bar").style.width = percentage + "%";
}
window.currentCategory=0;
window.categories=["全部"];
window.categoryid_to_thisId=[];
window.category_ids=["-1"];
window.buildCategoryIndex=function(){
    categoryid_to_thisId=[];
    for(let i=0;i<categories.length;i++){
        categoryid_to_thisId[category_ids[i]]=categories[i];
    }
}

window.getPosition=function(node){
    var left=node.offsetLeft; 
    current=node.offsetParent; 
    while(current!=null){
        left+=current.offsetLeft;
        current=current.offsetParent;
    }
    return left;
}
window.refreshCategories=function(){
    box=document.getElementById("categories");
    innerHTML="";
    for(var i=0;i<categories.length;i++){
        if(i==currentCategory){
            innerHTML+="<a class=\"category category-selected\" id=\"selectedCategory\">"+categories[i]+"</a>";
        }else{
            innerHTML+="<a class=\"category\" onclick=\"selectCategory("+i.toString()+")\">"+categories[i]+"</a>";
        }
    }
    box.innerHTML=innerHTML;
    selected=document.getElementById("selectedCategory");
    //get position of selected category
    selectPointer=document.getElementById("selectPointer");
    selectPointer.style.paddingLeft=(getPosition(selected)+selected.clientWidth/2-8)+"px";
}
window.selectCategory=function(arg){
    currentCategory=arg;
    refreshCategories();
    getpage(1);
}
window.onload=function(){
    getCategories();
}
window.openCategoryManager=function(){
    windowO=openWindow();
    windowO.innerHTML='<div id="wtitle"><div id="wtitle-left">类别管理器</div><div id="wtitle-right"><i class="iconfont mid-icon closer" onclick="closeWindow()">&#xe670;</i></div></div><div id="managerCategoryContainer"></div><div id="new"><input type="text" id="newCategoryInput" class="newCategoryName"/><a class="SmallButton" onclick="preNewCategory()"><i class="iconfont small-icon">&#xe845;</i></a></div>';
    getDetailedCategories()
}
window.newPart=function(){
    windowO=openWindow();
    windowO.innerHTML='<div id="wtitle"><div id="wtitle-left">新零件</div><div id="wtitle-right"><i class="iconfont mid-icon closer" onclick="closeWindow()">&#xe670;</i></div></div><div id="newpartline1"><div class="inputZone">类别<br><input type="text" value="'+categories[currentCategory]+'" class="inline-input" disabled></div><div class="inputZone">库存<br><input type="number" class="inline-input" id="remaining" value="0"></div><div class="inputZone">值<br><input type="text" class="inline-input" id="value" value="0"></div></div><div id="newpartline2t4"><div class="inputZoneL">名称<br><input type="text" class="inline-input" id="name"></div><div class="inputZoneL">自有编号<br><input type="text" class="inline-input" id="selfId"></div><div class="inputZoneL">条码<br><input type="text" class="inline-input" id="barcode"></div></div><a class="SmallButton" onclick="preNewPart()"><i class="iconfont small-icon">&#xe845;</i></a>';
}
window.preNewPart=function(){
    category=category_ids[currentCategory];
    remaining=document.getElementById("remaining").value;
    nicname=document.getElementById("name").value;
    selfId=document.getElementById("selfId").value;
    value=document.getElementById("value").value;
    barcode=document.getElementById("barcode").value;
    // to json
    json={};
    json["category"]=category;
    json["remaining"]=remaining;
    json["name"]=nicname;
    json["selfId"]=selfId;
    json["value"]=value;
    json["barcode"]=barcode;
    //json to string
    jsonstr=JSON.stringify(json);
    //send to server
    AJAXPostRequest("apis/newPart.php",jsonstr,closeWindow);
    getpage(curpage);
}
window.openHistory=function(){
    windowO=openWindow();
    windowO.innerHTML='<div id="wtitle"><div id="wtitle-left">记录(最近50条)</div><div id="wtitle-right"><i class="iconfont mid-icon closer" onclick="closeWindow()">&#xe670;</i></div></div><div id="logContainer"></div>';
    getLog();
}
window.openWindow=function(){
    document.getElementById("cover").style.display="block";
    windowO=document.getElementById("window");
    windowO.style.display="block";
    document.documentElement.style.overflow="hidden";
    document.body.scrollTop=document.documentElement.scrollTop=0;
    return windowO;
}
window.closeWindow=function(param=0){
    document.documentElement.style.overflow="auto";
    document.getElementById("cover").style.display="none";
    document.getElementById("window").style.display="none";
}
window.curpage=1;
window.sortingby=0;
window.sorting="ASC";
window.getpage=function(page){
    curpage=page;
    category=category_ids[currentCategory];
    //to json
    json={};
    json["category"]=category;
    json["page"]=page;
    json["sortingby"]=sortingby;
    json["sorting"]=sorting;
    //json to string
    jsonstr=JSON.stringify(json);
    //send to server
    AJAXPostRequest("apis/getPage.php",jsonstr,getpagestg2);
}
window.categories_pid=[]
window.getpagestg2=function(json_data){
    json_decoded=JSON.parse(json_data);
    curPage=json_decoded.page;
    totalPage=json_decoded.totalPage;
    contentHTML='<div class="card"><div class="card-left"><i class="iconfont mid-icon" id="sortingWay" onclick="changeSortingWay()">&#xe7d1;</i><select id="sorting" onchange="changeSorting()">';
    options=["零件ID","库存","名称","自有编号","值"];
    for(i=0;i<options.length;i++){
        if(i==sortingby){
            contentHTML+='<option selected>'+options[i]+'</option>';
        }else{
            contentHTML+='<option>'+options[i]+'</option>';
        }
    }
    contentHTML+='</select><div class="vertLine"> </div> 页';
    for(i=1;i<=totalPage;i++){
        if(i==curPage){
            contentHTML+='<a class="selectedPage">'+i.toString()+'&nbsp;</a>';
        }else{
            contentHTML+='<a onclick="getpage('+i.toString()+')" class="clickable pageSelect">'+i.toString()+'&nbsp;</a>';
        }
    }
    contentHTML+="</div>";
    if(currentCategory!=0){
        contentHTML+='<div class="card-right"><div class="vertLine"> </div><i class="iconfont mid-icon clickable" onclick="newPart()">&#xe845;</i></div>';
    }
    buildCategoryIndex()
    contentHTML+='</div>';
    for(i=0;i<json_decoded.items.length;i++){
        PartID=json_decoded.items[i].pid;
        catego=categoryid_to_thisId[json_decoded.items[i].category];
        categories_pid[PartID]=catego;
        remaining=json_decoded.items[i].remaining;
        namenick=json_decoded.items[i].name;
        selfId=json_decoded.items[i].selfId;
        value=json_decoded.items[i].value;
        contentHTML+='<div class="card card-green"><div class="card-left"><div class="attribute attribute-PartID"><div class="attribute-title">#零件ID</div><div class="attribute-content">'+PartID+'</div></div><div class="attribute attribute-Category"><div class="attribute-title">类别</div><div class="attribute-content">'+catego+'</div></div><div class="attribute attribute-Stock"><div class="attribute-title">库存</div><div class="attribute-content">'+remaining+'</div></div><div class="attribute attribute-Name"><div class="attribute-title">名称</div><div class="attribute-content">'+namenick+'</div></div><div class="attribute attribute-OwnID"><div class="attribute-title">自有编号</div><div class="attribute-content">'+selfId+'</div></div><div class="attribute attribute-Value"><div class="attribute-title">值</div><div class="attribute-content">'+value+'</div></div></div><div class="card-right"><div class="vertLine"> </div><i class="iconfont mid-icon clickable" onclick="modifyPart('+PartID+')">&#xe7e1;</i></div></div>';
    }
    document.getElementById("cardContainer").innerHTML=contentHTML;
    refreshSortingIcon();
}
window.modifyPart=function(pid){
    windowO=openWindow();
    windowO.innerHTML='<div id="wtitle"><div id="wtitle-left">修改零件 #'+pid.toString()+'</div><div id="wtitle-right"><i class="iconfont mid-icon closer" onclick="closeWindow()">&#xe670;</i></div></div><div id="newpartline1"><div class="inputZone">类别<br><input type="text" value="'+categories_pid[pid.toString()]+'" class="inline-input" disabled></div><div class="inputZone">库存<br><input type="number" class="inline-input" id="remaining" value="0"></div><div class="inputZone">值<br><input type="text" class="inline-input" id="value" value="0"></div></div><div id="newpartline2t4"><div class="inputZoneL">名称<br><input type="text" class="inline-input" id="name"></div><div class="inputZoneL">自有编号<br><input type="text" class="inline-input" id="selfId"></div><div class="inputZoneL">条码<br><input type="text" class="inline-input" id="barcode"></div></div><a class="SmallButton safe" onclick="preModifyPart('+pid.toString()+')"><i class="iconfont small-icon">&#xe7fc;</i></a> <a class="SmallButton danger" onclick="preDeletePart('+pid.toString()+')"><i class="iconfont small-icon">&#xe699;</i></a>';
    getPartInfo(pid);
}
window.preDeletePart=function(pid){
    p=confirm("确定要删除零件 #"+pid.toString()+"吗？");
    if(!p){
        return;
    }
    json={};
    json.pid=pid;
    jsonstr=JSON.stringify(json);
    AJAXPostRequest("apis/deletePart.php",jsonstr,function(param=0){closeWindow();getpage(curpage);});
}
window.preModifyPart=function(pid){
    remaining=document.getElementById("remaining").value;
    nicname=document.getElementById("name").value;
    selfId=document.getElementById("selfId").value;
    value=document.getElementById("value").value;
    barcode=document.getElementById("barcode").value;
    // to json
    json={};
    json["pid"]=pid;
    json["category"]=category;
    json["remaining"]=remaining;
    json["name"]=nicname;
    json["selfId"]=selfId;
    json["value"]=value;
    json["barcode"]=barcode;
    //json to string
    jsonstr=JSON.stringify(json);
    //send to server
    AJAXPostRequest("apis/modifyPart.php",jsonstr,function(param=0){closeWindow();getpage(curpage);});
}
window.refreshThisCategory=function(){
    getpage(1);
}
window.changeSorting=function(){
    p=document.getElementById("sorting").selectedIndex;
    console.log(p);
    sortingby=p;
    refreshThisCategory();
}
window.refreshSortingIcon=function(){
    if(sorting=="ASC"){
        document.getElementById("sortingWay").innerHTML="&#xe7d1;";
    }else{
        document.getElementById("sortingWay").innerHTML="&#xe73c;";
    }
}
window.changeSortingWay=function(){
    if(sorting=="ASC"){
        sorting="DESC";
    }else{
        sorting="ASC";
    }
    refreshSortingIcon();
    refreshThisCategory();
}
window.preNewCategory=function(){
    nam=document.getElementById("newCategoryInput").value;
    newCategory(nam);
}