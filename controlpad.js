var mask_lock = false;

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

  lmsk.style.opacity = "0.0";
  umsk.style.opacity = "0.0";
  rmsk.style.opacity = "0.0";
  dmsk.style.opacity = "0.0"; 

  if (Math.abs(offsetx) > Math.abs(offsety)) {
    if(offsetx <= 0){
      lmsk.style.clip = "rect(0px, 200px, 200px, "+(200+offsetx)+"px)";
      lmsk.style.opacity = "0.9";
      if(offsetx < -200){
        lmsk.style.opacity = "0.0";
        $(".lefticon").animate({
          top:'-=25%', left:'-=25%', height:'+=50%', opacity:'0.0'},900, 
          function(){ location.href='./canvas.html'})
      }
    }else{
      rmsk.style.clip = "rect(0px, "+offsetx+"px, 200px, 0px)";
      rmsk.style.opacity = "0.9";
      if(offsetx > 200){
        rmsk.style.opacity = "0.0";
        $(".righticon").animate({
          top:'-=25%', left:'-=25%', height:'+=50%', opacity:'0.0'},900, 
          function(){ location.href='./canvas.html'})
      }
    }
  } 
  else{
    if(offsety <= 0){
      umsk.style.clip = "rect("+(200+offsety)+"px, 200px, 200px, 0px)";
      umsk.style.opacity = "0.9";
      if(offsety < -200){
        umsk.style.opacity = "0.0";
        $(".upicon").animate({
          top:'-=25%', left:'-=25%', height:'+=50%', opacity:'0.0'},900, 
          function(){ location.href='./canvas.html'})
      }
    }else{
      dmsk.style.clip = "rect(0px, 200px, "+offsety+ "px, 0px)";
      dmsk.style.opacity = "0.9";
      if(offsety > 190){
        dmsk.style.opacity = "0.0";
        $(".downicon").animate({
          top:'-=25%', left:'-=25%', height:'+=50%', opacity:'0.0'},900, 
          function(){ location.href='./canvas.html'})
      }
    }
  }

  var coords1 = "offsetx: " + offsetx + ", offsety: " + offsety;
  document.getElementById("demo").innerHTML = "<font color=\"red\">" + coords1+"</font>";
}

function showControlPad(){
  $("#greyscreen").css({ "display": "block", "width":$(document).width(),"height":$(document).height()}); 
  $("#controlpad").show(700);
}

function hideControlPad(){
  $("#controlpad").hide(700);
  $("#greyscreen").css({ "display": "none", "width":$(document).width(),"height":$(document).height()}); 
}