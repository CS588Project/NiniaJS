var control_open = false;
var w = window.innerWidth;
var h = window.innerHeight;

function controlpad_initialization(){
  w = window.innerWidth;
  h = window.innerHeight;
  document.getElementById("cursor").width =  w;
  document.getElementById("cursor").height =  h;
}

function cursor(event){
  var cX = event.clientX;  
  var cY = event.clientY;
  var curs_ctx = document.getElementById("cursor").getContext("2d");
  //cursor
  curs_ctx.beginPath();
  curs_ctx.clearRect(0,0,w,h);
  curs_ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
  curs_ctx.arc(cX, cY, 20, 0, 2*Math.PI);
  curs_ctx.shadowColor = '#FFFFFF';
  curs_ctx.shadowBlur = 20;
  curs_ctx.moveTo(cX, cY);
  curs_ctx.fill();
  curs_ctx.closePath();

  //control pad
  padControl(event);
}

function showControlPad(){
  $("#greyscreen").css({ "display": "block", "width":$(document).width(),"height":$(document).height()}); 
  $("#controlpad").show(700, function(){ control_open = true;});
}

function hideControlPad(){
  $("#controlpad").hide(700, function(){ control_open = false;});
  $("#greyscreen").css({ "display": "none", "width":$(document).width(),"height":$(document).height()}); 
}

function padControl(event){
  var divCX =  window.innerWidth/2;
  var divCY =  window.innerHeight/2;
  var cX = event.clientX;  
  var cY = event.clientY;
  var offsetx = cX - divCX;
  var offsety = cY - divCY;
  var umsk = document.getElementById("umsk");
  var lmsk = document.getElementById("lmsk");
  var rmsk = document.getElementById("rmsk");
  var dmsk = document.getElementById("dmsk");
  
  var coords1 = "offsetx: " + offsetx + ", offsety: " + offsety;
  document.getElementById("demo").innerHTML = "<font color=\"red\">" + coords1+"</font>";

  lmsk.style.opacity = "0.0";
  umsk.style.opacity = "0.0";
  rmsk.style.opacity = "0.0";
  dmsk.style.opacity = "0.0"; 

  if(control_open){
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
        if(offsety > 200){
          dmsk.style.opacity = "0.0";
          $(".downicon").animate({
            top:'-=25%', left:'-=25%', height:'+=50%', opacity:'0.0'},900, 
            function(){ location.href='./canvas.html'})
        }
      }
    }
  }
}
