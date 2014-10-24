function padControl(event){
  var div_pos = $("#controlpad").position();
  var divCX = div_pos.left;
  var divCY = div_pos.top;
  var cX = event.clientX;  
  var cY = event.clientY;
  var offsetx = cX - divCX;
  var offsety = cY - divCY;
  var umsk = document.getElementById("umsk");
  var lmsk = document.getElementById("lmsk");
  var rmsk = document.getElementById("rmsk");
  var dmsk = document.getElementById("dmsk");

  if (Math.abs(offsetx) > Math.abs(offsety)) {
    if(offsetx <= 0){
      lmsk.style.clip = "rect(0px, 200px, 200px, "+(200+offsetx)+"px)";
      lmsk.style.opacity = "0.9";
      umsk.style.opacity = "0.0";
      rmsk.style.opacity = "0.0";
      dmsk.style.opacity = "0.0";
    }else{
      rmsk.style.clip = "rect(0px, "+offsetx+"px, 200px, 0px)";
      lmsk.style.opacity = "0.0";
      umsk.style.opacity = "0.0";
      rmsk.style.opacity = "0.9";
      dmsk.style.opacity = "0.0";
    }
  } 
  else{
    if(offsety <= 0){
      umsk.style.clip = "rect("+(200+offsety)+"px, 200px, 200px, 0px)";
      lmsk.style.opacity = "0.0";
      umsk.style.opacity = "0.9";
      rmsk.style.opacity = "0.0";
      dmsk.style.opacity = "0.0";
    }else{
      dmsk.style.clip = "rect(0px, 200px, "+offsety+ "px, 0px)";
      lmsk.style.opacity = "0.0";
      umsk.style.opacity = "0.0";
      rmsk.style.opacity = "0.0";
      dmsk.style.opacity = "0.9";
    }
  }

  var coords1 = "offsetx: " + offsetx + ", offsety: " + offsety;
  document.getElementById("demo").innerHTML = "<font color=\"red\">" + coords1+"</font>";
}

function showControlPad(){
  $("#controlpad").show();
}

function hideControlPad(){
  $("#controlpad").hide();
}