(()=>{var n={91:()=>{window.AJAXPostRequest=function(e,t,n){setLoadingBar(20);var i=new XMLHttpRequest;i.onreadystatechange=function(){1==i.readyState&&setLoadingBar(30),2==i.readyState&&setLoadingBar(40),3==i.readyState&&setLoadingBar(60),4==i.readyState&&(setLoadingBar(100),200==i.status&&(0!=(json_resolved=JSON.parse(i.responseText)).error?ExceptionHandler(json_resolved):n(i.responseText)))},i.open("POST",e,!0),i.setRequestHeader("Content-type","application/json"),i.send(t)},window.AJAXGetRequest=function(e,t,n){setLoadingBar(20),(xmlhttp=new XMLHttpRequest).onreadystatechange=function(){1==xmlhttp.readyState&&setLoadingBar(30),2==xmlhttp.readyState&&setLoadingBar(40),3==xmlhttp.readyState&&setLoadingBar(60),4==xmlhttp.readyState&&(setLoadingBar(100),200==xmlhttp.status&&(0!=(json_resolved=JSON.parse(xmlhttp.responseText)).error?ExceptionHandler(json_resolved):n(xmlhttp.responseText)))},xmlhttp.open("GET",e,!0),xmlhttp.setRequestHeader("Content-type","x-www-form-urlencoded"),xmlhttp.send()},window.getCategories=function(){AJAXGetRequest("apis/getCategoryList.php","",CategoryResolver)},window.getLog=function(){AJAXGetRequest("apis/getLog.php","",LogResolver)},window.getDetailedCategories=function(e=0){AJAXGetRequest("apis/getDetailedCategoryList.php","",DetailedCategoryResolver)},Date.prototype.format=function(e){var t,n={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};for(t in/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))),n)new RegExp("("+t+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?n[t]:("00"+n[t]).substr((""+n[t]).length)));return e},window.timeparse=function(e){return new Date(1e3*e).format("yyyy-MM-dd hh:mm:ss")},window.LogResolver=function(e){if(0!=(json_resolved=JSON.parse(e)).error)ExceptionHandler(json_resolved);else{json_logs=json_resolved.logs,container=document.getElementById("logContainer"),str="";for(let e=0;e<json_logs.length;e++)item="["+timeparse(json_logs[e].time)+"] "+json_logs[e].data,str+='<div class="managerCategory logtext">'+item+"</div>";container.innerHTML=str}},window.CategoryResolver=function(e){categories=["全部"],category_ids=[-1],json_resolved=JSON.parse(e);for(let e=0;e<json_resolved.categories.length;e++)categories.push(json_resolved.categories[e].category_name),category_ids.push(json_resolved.categories[e].category_id);currentCategory=0,refreshCategories(),getpage(1)},window.DetailedCategoryResolver=function(e){categories=["全部"],category_ids=[-1],json_resolved=JSON.parse(e);for(let e=0;e<json_resolved.categories.length;e++)categories.push(json_resolved.categories[e].category_name),category_ids.push(json_resolved.categories[e].category_id);managerCategoryContainer=document.getElementById("managerCategoryContainer"),str="";for(let e=0;e<json_resolved.categories.length;e++)str=str+'<div class="managerCategory"><div class="managerCategory-left">'+json_resolved.categories[e].category_name+' <div class="partNumShow"><a class="PartNumBig">'+json_resolved.categories[e].category_count.toString()+'</a><br>种零件</div></div><div class="managerCategory-right"><div class="vertLine"> </div><i class="iconfont large-icon clickable" onclick="deleteCategory('+json_resolved.categories[e].category_id+')">&#xe699;</i></div></div>';managerCategoryContainer.innerHTML=str},window.deleteCategory=function(e){(c=confirm("你确定要删除此类别吗？所有属于此类别的零件都将消失。该操作不可逆。"))&&(isNaN(e)?console.log("NAN."):AJAXGetRequest("apis/deleteCategory.php?cid="+e.toString(),"",function(){getDetailedCategories(),getCategories()}))},window.ExceptionHandler=function(e){console.log(e),setLoadingBar(100,1),windowO=openWindow(),1==e.error?windowO.innerHTML='<div id="wtitle"><div id="wtitle-left">出错啦！</div></div>你似乎没有登录。<br><a href="https://account.tmysam.top/" class="SmallButton">此处登录</a><br>错误代码：'+e.error+"<br>来自服务器的信息：<br>"+e.errmsg:windowO.innerHTML='<div id="wtitle"><div id="wtitle-left">出错啦！</div><div id="wtitle-right"><i class="iconfont mid-icon closer" onclick="confirm(\'你确定要忽略这个错误吗？\')?closeWindow():false">&#xe670;</i></div></div>错误代码：'+e.error+"<br>来自服务器的信息：<br>"+e.errmsg},window.newCategory=function(e){AJAXPostRequest("apis/newCategory.php",JSON.stringify({category_name:e}),function(){getDetailedCategories(),getCategories()})},window.getPartInfo=function(e){AJAXGetRequest("apis/getPartInfo.php?pid="+e.toString(),"",getPartInfoResolver)},window.getPartInfoResolver=function(e){json_resolved=JSON.parse(e),document.getElementById("remaining").value=json_resolved.remaining,document.getElementById("name").value=json_resolved.name,document.getElementById("selfId").value=json_resolved.selfId,document.getElementById("value").value=json_resolved.value,document.getElementById("barcode").value=json_resolved.barcode};var e,t,n=window._paq=window._paq||[];n.push(["trackPageView"]),n.push(["enableLinkTracking"]),e="//security.tmysam.top/matomo/",n.push(["setTrackerUrl",e+"matomo.php"]),n.push(["setSiteId","1"]),n=document,t=n.createElement("script"),n=n.getElementsByTagName("script")[0],t.async=!0,t.src=e+"matomo.js",n.parentNode.insertBefore(t,n)},374:()=>{var n=!1,o=0;window.setLoadingBar=function(e,t=0){if(t){n=!0;try{window.clearTimeout(o)}catch(e){}return document.getElementById("loading-bar").style.height="5px",document.getElementById("loading-bar").style.width="100%",void(document.getElementById("loading-bar").style.backgroundColor="#FF5A5A")}document.getElementById("loading-bar").style.backgroundColor="#3dc8ff",100==e||0==e?(document.getElementById("loading-bar").style.height="0px",n=!1,100==e&&(o=setTimeout("setLoadingBar(0)",200))):n||(n=!0,document.getElementById("loading-bar").style.height="3px"),document.getElementById("loading-bar").style.width=e+"%"},window.currentCategory=0,window.categories=["全部"],window.categoryid_to_thisId=[],window.category_ids=["-1"],window.buildCategoryIndex=function(){categoryid_to_thisId=[];for(let e=0;e<categories.length;e++)categoryid_to_thisId[category_ids[e]]=categories[e]},window.getPosition=function(e){var t=e.offsetLeft;for(current=e.offsetParent;null!=current;)t+=current.offsetLeft,current=current.offsetParent;return t},window.refreshCategories=function(){box=document.getElementById("categories"),innerHTML="";for(var e=0;e<categories.length;e++)e==currentCategory?innerHTML+='<a class="category category-selected" id="selectedCategory">'+categories[e]+"</a>":innerHTML+='<a class="category" onclick="selectCategory('+e.toString()+')">'+categories[e]+"</a>";box.innerHTML=innerHTML,selected=document.getElementById("selectedCategory"),(selectPointer=document.getElementById("selectPointer")).style.paddingLeft=getPosition(selected)+selected.clientWidth/2-8+"px"},window.selectCategory=function(e){currentCategory=e,refreshCategories(),getpage(1)},window.onload=function(){getCategories()},window.openCategoryManager=function(){(windowO=openWindow()).innerHTML='<div id="wtitle"><div id="wtitle-left">类别管理器</div><div id="wtitle-right"><i class="iconfont mid-icon closer" onclick="closeWindow()">&#xe670;</i></div></div><div id="managerCategoryContainer"></div><div id="new"><input type="text" id="newCategoryInput" class="newCategoryName"/><a class="SmallButton" onclick="preNewCategory()"><i class="iconfont small-icon">&#xe845;</i></a></div>',getDetailedCategories()},window.newPart=function(){(windowO=openWindow()).innerHTML='<div id="wtitle"><div id="wtitle-left">新零件</div><div id="wtitle-right"><i class="iconfont mid-icon closer" onclick="closeWindow()">&#xe670;</i></div></div><div id="newpartline1"><div class="inputZone">类别<br><input type="text" value="'+categories[currentCategory]+'" class="inline-input" disabled></div><div class="inputZone">库存<br><input type="number" class="inline-input" id="remaining" value="0"></div><div class="inputZone">值<br><input type="text" class="inline-input" id="value" value="0"></div></div><div id="newpartline2t4"><div class="inputZoneL">名称<br><input type="text" class="inline-input" id="name"></div><div class="inputZoneL">自有编号<br><input type="text" class="inline-input" id="selfId"></div><div class="inputZoneL">条码<br><input type="text" class="inline-input" id="barcode"></div></div><a class="SmallButton" onclick="preNewPart()"><i class="iconfont small-icon">&#xe845;</i></a>'},window.preNewPart=function(){category=category_ids[currentCategory],remaining=document.getElementById("remaining").value,nicname=document.getElementById("name").value,selfId=document.getElementById("selfId").value,value=document.getElementById("value").value,barcode=document.getElementById("barcode").value,(json={}).category=category,json.remaining=remaining,json.name=nicname,json.selfId=selfId,json.value=value,json.barcode=barcode,jsonstr=JSON.stringify(json),AJAXPostRequest("apis/newPart.php",jsonstr,closeWindow),getpage(curpage)},window.openHistory=function(){(windowO=openWindow()).innerHTML='<div id="wtitle"><div id="wtitle-left">记录(最近50条)</div><div id="wtitle-right"><i class="iconfont mid-icon closer" onclick="closeWindow()">&#xe670;</i></div></div><div id="logContainer"></div>',getLog()},window.openWindow=function(){return document.getElementById("cover").style.display="block",(windowO=document.getElementById("window")).style.display="block",document.documentElement.style.overflow="hidden",document.body.scrollTop=document.documentElement.scrollTop=0,windowO},window.closeWindow=function(e=0){document.documentElement.style.overflow="auto",document.getElementById("cover").style.display="none",document.getElementById("window").style.display="none"},window.curpage=1,window.sortingby=0,window.sorting="ASC",window.getpage=function(e){curpage=e,category=category_ids[currentCategory],(json={}).category=category,json.page=e,json.sortingby=sortingby,json.sorting=sorting,jsonstr=JSON.stringify(json),AJAXPostRequest("apis/getPage.php",jsonstr,getpagestg2)},window.categories_pid=[],window.getpagestg2=function(e){for(json_decoded=JSON.parse(e),curPage=json_decoded.page,totalPage=json_decoded.totalPage,contentHTML='<div class="card"><div class="card-left"><i class="iconfont mid-icon" id="sortingWay" onclick="changeSortingWay()">&#xe7d1;</i><select id="sorting" onchange="changeSorting()">',options=["零件ID","库存","名称","自有编号","值"],i=0;i<options.length;i++)i==sortingby?contentHTML+="<option selected>"+options[i]+"</option>":contentHTML+="<option>"+options[i]+"</option>";for(contentHTML+='</select><div class="vertLine"> </div> 页',i=1;i<=totalPage;i++)i==curPage?contentHTML+='<a class="selectedPage">'+i.toString()+"&nbsp;</a>":contentHTML+='<a onclick="getpage('+i.toString()+')" class="clickable pageSelect">'+i.toString()+"&nbsp;</a>";for(contentHTML+="</div>",0!=currentCategory&&(contentHTML+='<div class="card-right"><div class="vertLine"> </div><i class="iconfont mid-icon clickable" onclick="newPart()">&#xe845;</i></div>'),buildCategoryIndex(),contentHTML+="</div>",i=0;i<json_decoded.items.length;i++)PartID=json_decoded.items[i].pid,catego=categoryid_to_thisId[json_decoded.items[i].category],categories_pid[PartID]=catego,remaining=json_decoded.items[i].remaining,namenick=json_decoded.items[i].name,selfId=json_decoded.items[i].selfId,value=json_decoded.items[i].value,contentHTML+='<div class="card card-green"><div class="card-left"><div class="attribute attribute-PartID"><div class="attribute-title">#零件ID</div><div class="attribute-content">'+PartID+'</div></div><div class="attribute attribute-Category"><div class="attribute-title">类别</div><div class="attribute-content">'+catego+'</div></div><div class="attribute attribute-Stock"><div class="attribute-title">库存</div><div class="attribute-content">'+remaining+'</div></div><div class="attribute attribute-Name"><div class="attribute-title">名称</div><div class="attribute-content">'+namenick+'</div></div><div class="attribute attribute-OwnID"><div class="attribute-title">自有编号</div><div class="attribute-content">'+selfId+'</div></div><div class="attribute attribute-Value"><div class="attribute-title">值</div><div class="attribute-content">'+value+'</div></div></div><div class="card-right"><div class="vertLine"> </div><i class="iconfont mid-icon clickable" onclick="modifyPart('+PartID+')">&#xe7e1;</i></div></div>';document.getElementById("cardContainer").innerHTML=contentHTML,refreshSortingIcon()},window.modifyPart=function(e){(windowO=openWindow()).innerHTML='<div id="wtitle"><div id="wtitle-left">修改零件 #'+e.toString()+'</div><div id="wtitle-right"><i class="iconfont mid-icon closer" onclick="closeWindow()">&#xe670;</i></div></div><div id="newpartline1"><div class="inputZone">类别<br><input type="text" value="'+categories_pid[e.toString()]+'" class="inline-input" disabled></div><div class="inputZone">库存<br><input type="number" class="inline-input" id="remaining" value="0"></div><div class="inputZone">值<br><input type="text" class="inline-input" id="value" value="0"></div></div><div id="newpartline2t4"><div class="inputZoneL">名称<br><input type="text" class="inline-input" id="name"></div><div class="inputZoneL">自有编号<br><input type="text" class="inline-input" id="selfId"></div><div class="inputZoneL">条码<br><input type="text" class="inline-input" id="barcode"></div></div><a class="SmallButton safe" onclick="preModifyPart('+e.toString()+')"><i class="iconfont small-icon">&#xe7fc;</i></a> <a class="SmallButton danger" onclick="preDeletePart('+e.toString()+')"><i class="iconfont small-icon">&#xe699;</i></a>',getPartInfo(e)},window.preDeletePart=function(e){(p=confirm("确定要删除零件 #"+e.toString()+"吗？"))&&((json={}).pid=e,jsonstr=JSON.stringify(json),AJAXPostRequest("apis/deletePart.php",jsonstr,function(e=0){closeWindow(),getpage(curpage)}))},window.preModifyPart=function(e){remaining=document.getElementById("remaining").value,nicname=document.getElementById("name").value,selfId=document.getElementById("selfId").value,value=document.getElementById("value").value,barcode=document.getElementById("barcode").value,(json={}).pid=e,json.category=category,json.remaining=remaining,json.name=nicname,json.selfId=selfId,json.value=value,json.barcode=barcode,jsonstr=JSON.stringify(json),AJAXPostRequest("apis/modifyPart.php",jsonstr,function(e=0){closeWindow(),getpage(curpage)})},window.refreshThisCategory=function(){getpage(1)},window.changeSorting=function(){p=document.getElementById("sorting").selectedIndex,console.log(p),sortingby=p,refreshThisCategory()},window.refreshSortingIcon=function(){"ASC"==sorting?document.getElementById("sortingWay").innerHTML="&#xe7d1;":document.getElementById("sortingWay").innerHTML="&#xe73c;"},window.changeSortingWay=function(){sorting="ASC"==sorting?"DESC":"ASC",refreshSortingIcon(),refreshThisCategory()},window.preNewCategory=function(){nam=document.getElementById("newCategoryInput").value,newCategory(nam)}}},o={};function a(e){var t=o[e];if(void 0!==t)return t.exports;t=o[e]={exports:{}};return n[e](t,t.exports,a),t.exports}(()=>{"use strict";a(91),a(374)})()})();