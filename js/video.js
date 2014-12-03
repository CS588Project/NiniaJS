var openvideo = false;
var w = window.innerWidth;
var h = window.innerHeight;
var videoIds = [];

$(document).ready(function(){
	myNewFlow = new ContentFlow('theflow', {endOpacity:0.5, visibleItems:4, relativeItemPosition:'center top', maxItemHeight:0.5*h, flowSpeedFactor:0.5});
	loadConfiguration();
});

function loadConfiguration(){
	var xmlhttp;
	if(window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}
	else{// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
			var id = JSON.parse(xmlhttp.responseText);
			for(var i = 0; i < id.ids.length; i++){
				videoIds.push(id.ids[i]);
			}
			var anchor = document.getElementById("anchorToAddImage");
			for(var i = 0; i < videoIds.length; i++){
				var innerDiv = document.createElement('div');
				innerDiv.className = "item";
				var innerImg = document.createElement('img');
				innerImg.className = "content";
				innerImg.src = "http://img.youtube.com/vi/" + videoIds[i] + "/0.jpg";
				innerDiv.appendChild(innerImg);
				anchor.appendChild(innerDiv);
			}
			video_num = videoIds.length;
		}
	}
	xmlhttp.open("GET","videos.json",true);
	xmlhttp.send();
}

function moveToIndex(deltaIndex) {
	console.warn(deltaIndex);
    var object = myNewFlow.getActiveItem();
    myNewFlow.moveTo((object['index'] + deltaIndex)%video_num);
}

function openVideo(){
	if(openvideo == false){
		var url = "youtube.html?id=" + videoIds[myNewFlow.getActiveItem()["index"]];
		$.colorbox({iframe:true, id:"popup", href:url, innerWidth: w * 0.9, innerHeight: h * 0.85, onComplete:function(){document.getElementById("cboxLoadedContent").getElementsByTagName("iframe")[0].focus();}});
		openvideo = true;
		handOut(); 
	}else{
		$.colorbox.close();
		openvideo = false;
	}
}