//global variables
var canvas = null, ctx = null; // canvas context
var started = false; 
var globalGesture = null;   
var timer = null; // used to detech shaking hands by recognizing KeyTap getsture
var timerStarted = false;
var keyTapNum = 0;
var cur_state="IDLE",prev_state=null;
var eraseStarted = false;
var colorPaletteStarted = false;
var globalColor = "black";
var iniColorGroup1 = 0,iniColorGroup4 = 90, iniColorGroup3 = 180, iniColorGroup2 = 270, stepAngle = 0, curColorGroup = 1;
var reg1,reg2 = true;
var circleDirection;

$(document).ready(function() {  
  canvas = document.getElementById("myCanvas")
    var curColor = "red"; 
  var sizeSmall=5;
  var sizeNormal=10;
  var sizeLarge=15;
  var curSize=sizeNormal;
  $(window).resize(resizeCanvas);
  resizeCanvas();
  function resizeCanvas() {
    $("#myCanvas").attr("width", $(window).get(0).innerWidth);
    $("#myCanvas").attr("height", $(window).get(0).innerHeight);
  };
  //Initialize the color palette
  $(".group1").children().eq(0).addClass("colorDegree270");
  $(".group1").children().eq(1).addClass("colorDegree300");
  $(".group1").children().eq(2).addClass("colorDegree330");
  $(".group4").children().eq(0).addClass("colorDegree0");
  $(".group4").children().eq(1).addClass("colorDegree30");
  $(".group4").children().eq(2).addClass("colorDegree60");
  $(".group3").children().eq(0).addClass("colorDegree90");
  $(".group3").children().eq(1).addClass("colorDegree120");
  $(".group3").children().eq(2).addClass("colorDegree150"); 
  
  $(".group2").children().eq(0).addClass("colorDegree180");
  $(".group2").children().eq(1).addClass("colorDegree210");
  $(".group2").children().eq(2).addClass("colorDegree240");
  
  //canvas context
  ctx=document.getElementById("myCanvas").getContext("2d");
  ctx.fillStyle="black";
  ctx.fillRect(0,0,$(window).get(0).innerWidth,$(window).get(0).innerHeight);
  ctx.beginPath();  
  });
  // Setup Leap loop with frame callback function
  var controllerOptions = {enableGestures: true};

  Leap.loop(controllerOptions, function(frame) {

    // Create circle to represent finger
    var canvasElement = document.getElementById("myCanvas");
    var cursorLeapMotion = document.getElementById("leapCursor");
    var distanceDisplay = document.getElementById("distance");

  if(frame.pointables.length > 0){
    overlappingDetection();
    var pointable = frame.pointables[1];
    var interactionBox = frame.interactionBox;
    var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);
    var cursorX = window.innerWidth * normalizedPosition[0];
    var cursorY = window.innerHeight * (1 - normalizedPosition[1]);
    cursorLeapMotion.style.left = cursorX/window.innerWidth*100+"%"
    cursorLeapMotion.style.top = cursorY/window.innerHeight*100+"%"
    if (frame.hands.length > 0){
      for (var i = 0; i < frame.hands.length; i++) {
        var hand = frame.hands[i];
        if( hand.pinchStrength==0 ){
          globalGesture = "Erase";
          cursorLeapMotion.innerHTML = "Erase Cursor";
        }
        else{
          globalGesture = "Draw";
          cursorLeapMotion.innerHTML = "Draw Cursor";
        }
      }
    }
    
    if( globalGesture=="Erase" ){
      var touchDistance = pointable.touchDistance;
      if(touchDistance<0){
        prev_state = cur_state
        cur_state = "ERASE_ON";
        cursorLeapMotion.style.backgroundColor="rgb(255,0,0)";
        if(prev_state=="ERASE_OFF"||prev_state=="DRAW_ON"){
          //console.log("Prev state: DRAW_ON ");
          ctx.beginPath();
          ctx.strokeStyle="black";
          ctx.lineWidth=40;
          started = true;
        }           
        if(started==false)
          leapTouchDown(cursorX,cursorY);
        else
          leapTouchMove(cursorX,cursorY);
      }
      else{
        leapTouchUp();
        prev_state = cur_state
        cur_state = "ERASE_OFF";
        cursorLeapMotion.style.backgroundColor="rgb(0,255,0)";
      }
    }else if( globalGesture=="Draw" ){
      var touchDistance = pointable.touchDistance;
      if(touchDistance<0){
        prev_state = cur_state;
        cur_state = "DRAW_ON";
        cursorLeapMotion.style.backgroundColor="rgb(255,0,0)";
        if(prev_state=="DRAW_OFF" || prev_state=="ERASE_ON"){
          ctx.beginPath();
          ctx.strokeStyle=globalColor;
          ctx.lineWidth=10;
          started = true;
        }
        if(started==false)
          leapTouchDown(cursorX,cursorY);
        else
          leapTouchMove(cursorX,cursorY);
      }
      else{
        prev_state = cur_state;
        cur_state = "DRAW_OFF";
        cursorLeapMotion.style.backgroundColor="rgb(0,255,0)";
        leapTouchUp();
      }
      distanceDisplay.innerText = touchDistance;
        }
    
    if(colorPaletteStarted==true){
      if( Math.sqrt(cursorX*cursorX+cursorY*cursorY)>100 )
         mouseMove(null,cursorX,cursorY);
    }
  
  //console.log(curColorGroup);
}  
  if (frame.gestures.length > 0) {  
    var gestureString = null;
    for (var i = 0; i < frame.gestures.length; i++) {
      var gesture = frame.gestures[i];
      gestureString += "Gesture ID: " + gesture.id + ", "
              + "type: " + gesture.type + ", "
              + "state: " + gesture.state + ", "
              + "hand IDs: " + gesture.handIds.join(", ") + ", "
              + "pointable IDs: " + gesture.pointableIds.join(", ") + ", "
              + "duration: " + gesture.duration + " &micro;s, ";
              
      switch (gesture.type) {

        case "circle":
        /*
        keyTapNum++;
        if(globalGesture=="Erase"&&!timerStarted){
          timer = self.setInterval("checkKeyTapNum()",2000);
          timerStarted = true;
        }
        console.log("circle");
        */
        circle = frame.gestures[0];
        // Get Pointable object
        circle.pointable = frame.pointable(circle.pointableIds[0]);
        // Reset circle gesture variables as nedded, not really necessary in this case
        if(circle.state == 'start') {
          clockwise = true;
        } else if (circle.state == 'update') {
          direction = circle.pointable.direction;
          // Check if pointable exists
          if(direction) {
            normal = circle.normal;
            // Check if product of vectors is going forwards or backwards
            // Since Leap uses a right hand rule system
            // forward is into the screen, while backwards is out of it
            clockwise = Leap.vec3.dot(direction, normal) > 0;
              if(clockwise) {
                //Do clockwose stuff
                circleDirection = "clockwise";
                console.log("clockwise");
              } else {
                  //Do counterclockwise stuff
                console.log("counterclockwise");
                circleDirection = "counterclockwise";
              }
          }
        }
         reg1 = reg2
         if( gesture.state=="update" ){
          reg2 = true;
         }else if( gesture.state=="stop" ){
          reg2 = false;
         }
         if( reg1 & (!reg2)){
          console.log("Circle Ends");
          if(circleDirection=="clockwise"&&started==false){
            increaseColorGroup();
          }
          else if(circleDirection=="counterclockwise"&&started==false){
            decreaseColorGroup();
          }
        }
        break;
        /*
        case "swipe":
        gestureString += "start position: " + vectorToString(gesture.startPosition) + " mm, "
                + "current position: " + vectorToString(gesture.position) + " mm, "
                + "direction: " + vectorToString(gesture.direction, 1) + ", "
                + "speed: " + gesture.speed.toFixed(1) + " mm/s";
        break;
        */
        case "screenTap":
        break;
        
        case "keyTap":
        keyTapNum++;
        gestureString += "position: " + vectorToString(gesture.position) + " mm";
        if(globalGesture=="Erase"&&!timerStarted){
          timer = self.setInterval("checkKeyTapNum()",2000);
          timerStarted = true;
          console.log("Timer started.");
        }
        
        console.log("keyTap");
        break;
        default:
      }
      gestureString += "<br />";
    }
  } 
}
)

var overlaps = (function () {
  function getPositions( elem ) {
    var pos, width, height;
    pos = $( elem ).position();
    width = $( elem ).width();
    height = $( elem ).height();
    return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
  }

  function comparePositions( p1, p2 ) {
    var r1, r2;
    r1 = p1[0] < p2[0] ? p1 : p2;
    r2 = p1[0] < p2[0] ? p2 : p1;
    return r1[1] > r2[0] || r1[0] === r2[0];
  }
    return function ( a, b ) {
  var pos1 = getPositions( a ),
    pos2 = getPositions( b );
  return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
  };
})();

function overlappingDetection(){
  
  var leapCursor = $( '#leapCursor' )[0];
  var colorPalette = document.getElementById("colorPalette");
  
  if(overlaps( leapCursor, colorPalette )==true){
    console.log("Leap overlaps Color Palette");
    colorPaletteStarted = true;
    triggerColorPallette();
  }
}

function leapTouchDown(leapX,leapY){
  ctx.beginPath(); 
  started = true;  
}
function leapTouchMove(leapX,leapY){
  ctx.lineTo(leapX, leapY);  
  ctx.stroke();  
}
function leapTouchUp(){
  started = false;
}
      
function vectorToString(vector, digits){
  if (typeof digits === "undefined") {
      digits = 1;
  }
  return "(" + vector[0].toFixed(digits) + ", "
      + vector[1].toFixed(digits) + ", "
      + vector[2].toFixed(digits) + ")";
}

function checkKeyTapNum(){
  if(keyTapNum>=5){
    console.log("Gesture: Shaking hands.")
  }
  timerStarted = false;
  keyTapNum = 0;
  console.log("Timer is out.");
}

function triggerColorPallette(){
  
}

function unTriggerColorPallette(){
  colorPaletteStarted = false;
  resetColorPallette();
}
function resetColorPallette(){
  
  var resetColor1,resetColor2,resetColor3;
  resetColor1 = (curColorGroup==1)?$(".group1").children().eq(0)[0]:(curColorGroup==4)?$(".group4").children().eq(0)[0]:$(".group3").children().eq(0)[0];
  resetColor1.style.width=200+"px";
  resetColor1.style.height=200+"px";
  resetColor1.style.borderTopLeftRadius="0px";
  resetColor1.style.borderTopRightRadius="0px";
  resetColor1.style.borderBottomLeftRadius="0px";
  resetColor1.style.borderBottomRightRadius="200px";
   
  resetColor2 = (curColorGroup==1)?$(".group1").children().eq(1)[0]:(curColorGroup==4)?$(".group4").children().eq(1)[0]:$(".group3").children().eq(1)[0];
  resetColor2.style.width=200+"px";
  resetColor2.style.height=200+"px";
  resetColor2.style.borderTopLeftRadius="0px";
  resetColor2.style.borderTopRightRadius="0px";
  resetColor2.style.borderBottomLeftRadius="0px";
  resetColor2.style.borderBottomRightRadius="200px";
  
  resetColor3 = (curColorGroup==1)?$(".group1").children().eq(2)[0]:(curColorGroup==4)?$(".group4").children().eq(2)[0]:$(".group3").children().eq(2)[0];
  resetColor3.style.width=200+"px";
  resetColor3.style.height=200+"px";
  resetColor3.style.borderTopLeftRadius="0px";
  resetColor3.style.borderTopRightRadius="0px";
  resetColor3.style.borderBottomLeftRadius="0px";
  resetColor3.style.borderBottomRightRadius="200px";

}

function increaseColorGroup(){

  stepAngle = 90;
  
    if(curColorGroup==1){
      //var prev = document.getElementById("colorPaletteSub3").style.zIndex;
      //document.getElementById("colorPaletteSub3").style.zIndex = document.getElementById("colorPaletteSub4").style.zIndex + 1;
      //document.getElementById("colorPaletteSub4").style.zIndex = 3;
      document.getElementById("colorPaletteSub3").style.zIndex = 3;
      document.getElementById("colorPaletteSub4").style.zIndex = 2;
      console.log("click-1");
    }
    else if(curColorGroup==4){
      //document.getElementById("colorPaletteSub2").style.zIndex = document.getElementById("colorPaletteSub3").style.zIndex;
      document.getElementById("colorPaletteSub3").style.zIndex = 2;
      document.getElementById("colorPaletteSub4").style.zIndex = 3;
      document.getElementById("colorPaletteSub2").style.zIndex = 3;
      document.getElementById("colorPaletteSub1").style.zIndex = 3;
      console.log("click-4");
    
    }else if(curColorGroup==3){
      //document.getElementById("colorPaletteSub1").style.zIndex = document.getElementById("colorPaletteSub2").style.zIndex;
      document.getElementById("colorPaletteSub2").style.zIndex = 2;
      //document.getElementById("colorPaletteSub1").style.zIndex = 4;
      console.log("click-3");
    }else if(curColorGroup==2){
      //document.getElementById("colorPaletteSub4").style.zIndex = document.getElementById("colorPaletteSub1").style.zIndex + 1;
      document.getElementById("colorPaletteSub1").style.zIndex = 2;
      /*
      document.getElementById("colorPaletteSub4").style.zIndex = 4;
      document.getElementById("colorPaletteSub3").style.zIndex = 3;
      document.getElementById("colorPaletteSub2").style.zIndex = 3;
      document.getElementById("colorPaletteSub1").style.zIndex = 3;
      */
      console.log("click-2");
    }
    
  
    document.getElementById("colorPaletteSub1").style.webkitTransform="rotate("+(iniColorGroup1+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub1").style.msTransform="rotate("+(iniColorGroup1+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub1").style.mozTransform="rotate("+(iniColorGroup1+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub1").style.oTransform="rotate("+(iniColorGroup1+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub1").style.Transform="rotate("+(iniColorGroup1+stepAngle)+"deg)";
    iniColorGroup1 += stepAngle;
        
    document.getElementById("colorPaletteSub4").style.webkitTransform="rotate("+(iniColorGroup4+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub4").style.msTransform="rotate("+(iniColorGroup4+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub4").style.mozTransform="rotate("+(iniColorGroup4+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub4").style.oTransform="rotate("+(iniColorGroup4+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub4").style.Transform="rotate("+(iniColorGroup4+stepAngle)+"deg)";
    iniColorGroup4 += stepAngle;
    
    document.getElementById("colorPaletteSub3").style.webkitTransform="rotate("+(iniColorGroup3+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub3").style.msTransform="rotate("+(iniColorGroup3+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub3").style.mozTransform="rotate("+(iniColorGroup3+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub3").style.oTransform="rotate("+(iniColorGroup3+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub3").style.Transform="rotate("+(iniColorGroup3+stepAngle)+"deg)";
    iniColorGroup3 += stepAngle;
    
    document.getElementById("colorPaletteSub2").style.webkitTransform="rotate("+(iniColorGroup2+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub2").style.msTransform="rotate("+(iniColorGroup2+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub2").style.mozTransform="rotate("+(iniColorGroup2+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub2").style.oTransform="rotate("+(iniColorGroup2+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub2").style.Transform="rotate("+(iniColorGroup2+stepAngle)+"deg)";
    iniColorGroup2 += stepAngle;
    
    //leftShit();
    if(curColorGroup==4)
      curColorGroup = 1;
    else
      curColorGroup = curColorGroup+1;
}

function decreaseColorGroup(){
  
  
  stepAngle = -90;
  //if(iniColorGroup1>-180){
  
    if(curColorGroup==1){
      //var prev = document.getElementById("colorPaletteSub3").style.zIndex;
      //document.getElementById("colorPaletteSub3").style.zIndex = document.getElementById("colorPaletteSub4").style.zIndex + 1;
      document.getElementById("colorPaletteSub4").style.zIndex = 3;
      document.getElementById("colorPaletteSub3").style.zIndex = 4;
      console.log("click-1");
    }
    else if(curColorGroup==4){
      //document.getElementById("colorPaletteSub2").style.zIndex = document.getElementById("colorPaletteSub3").style.zIndex;
      document.getElementById("colorPaletteSub2").style.zIndex = 4;
      console.log("click-4");
    
    }else if(curColorGroup==3){
      //document.getElementById("colorPaletteSub1").style.zIndex = document.getElementById("colorPaletteSub2").style.zIndex;
      document.getElementById("colorPaletteSub1").style.zIndex = 4;
      console.log("click-3");
    }else if(curColorGroup==2){
      //document.getElementById("colorPaletteSub4").style.zIndex = document.getElementById("colorPaletteSub1").style.zIndex + 1;
      document.getElementById("colorPaletteSub4").style.zIndex = 4;
      document.getElementById("colorPaletteSub3").style.zIndex = 3;
      document.getElementById("colorPaletteSub2").style.zIndex = 3;
      document.getElementById("colorPaletteSub1").style.zIndex = 3;
      console.log("click-2");
    }
    
    document.getElementById("colorPaletteSub1").style.webkitTransform="rotate("+(iniColorGroup1+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub1").style.msTransform="rotate("+(iniColorGroup1+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub1").style.mozTransform="rotate("+(iniColorGroup1+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub1").style.oTransform="rotate("+(iniColorGroup1+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub1").style.Transform="rotate("+(iniColorGroup1+stepAngle)+"deg)";
    iniColorGroup1 += stepAngle;
    
    document.getElementById("colorPaletteSub4").style.webkitTransform="rotate("+(iniColorGroup4+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub4").style.msTransform="rotate("+(iniColorGroup4+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub4").style.mozTransform="rotate("+(iniColorGroup4+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub4").style.oTransform="rotate("+(iniColorGroup4+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub4").style.Transform="rotate("+(iniColorGroup4+stepAngle)+"deg)";
    iniColorGroup4 += stepAngle;
  
    document.getElementById("colorPaletteSub3").style.webkitTransform="rotate("+(iniColorGroup3+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub3").style.msTransform="rotate("+(iniColorGroup3+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub3").style.mozTransform="rotate("+(iniColorGroup3+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub3").style.oTransform="rotate("+(iniColorGroup3+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub3").style.Transform="rotate("+(iniColorGroup3+stepAngle)+"deg)";
    iniColorGroup3 += stepAngle;
    
    document.getElementById("colorPaletteSub2").style.webkitTransform="rotate("+(iniColorGroup2+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub2").style.msTransform="rotate("+(iniColorGroup2+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub2").style.mozTransform="rotate("+(iniColorGroup2+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub2").style.oTransform="rotate("+(iniColorGroup2+stepAngle)+"deg)";
    document.getElementById("colorPaletteSub2").style.Transform="rotate("+(iniColorGroup2+stepAngle)+"deg)";
    iniColorGroup2 += stepAngle;
    
    if(curColorGroup==1)
      curColorGroup = 4;
    else
      curColorGroup = curColorGroup-1;
}

function mouseMove(event,leapX,leapY){
  
      var cX,cY;
      if(event!=null){
        cX = event.clientX;  
        cY = event.clientY;
      }else{
        cX = leapX;  
        cY = leapY;
      }
      
      var side = Math.sqrt(cX*cX+cY*cY);
      var alpha = Math.asin(1.0*cY/side)/Math.PI*180;
      console.log("alpha = "+alpha);
      var beta,fillWidth;
          
      if(alpha>=0&&alpha<30&&colorPaletteStarted==true){         
        
        if(side>300){
          console.log(globalColor);
          document.getElementById("realTime").innerText = "Select color: "+globalColor + " Degree is: " + alpha;
          document.getElementById("colorPalette").style.backgroundColor = globalColor;
          unTriggerColorPallette();
        }else{
          var targetColor;
          targetColor = (curColorGroup==1)?$(".group1").children().eq(0)[0]:(curColorGroup==4)?$(".group4").children().eq(0)[0]:$(".group3").children().eq(0)[0];
          targetColor.style.width=100+side+"px";
          targetColor.style.height=100+side+"px";
          targetColor.style.borderTopLeftRadius="0px";
          targetColor.style.borderTopRightRadius="0px";
          targetColor.style.borderBottomLeftRadius="0px";
          targetColor.style.borderBottomRightRadius=100+side+"0px";
  
          globalColor = window.getComputedStyle(targetColor, null).backgroundColor;
        }
        
      }else if(alpha>=30&&alpha<60&&colorPaletteStarted==true){

        if(side>300){
          console.log(globalColor);
          document.getElementById("realTime").innerText = "Select color: "+globalColor + " Degree is: " + alpha;
          document.getElementById("colorPalette").style.backgroundColor = globalColor;
          unTriggerColorPallette();
        }else{
          var targetColor;
          targetColor = (curColorGroup==1)?$(".group1").children().eq(1)[0]:(curColorGroup==4)?$(".group4").children().eq(1)[0]:$(".group3").children().eq(1)[0];
          targetColor.style.width=100+side+"px";
          targetColor.style.height=100+side+"px";
          targetColor.style.borderTopLeftRadius="0px";
          targetColor.style.borderTopRightRadius="0px";
          targetColor.style.borderBottomLeftRadius="0px";
          targetColor.style.borderBottomRightRadius=100+side+"0px";
          globalColor = window.getComputedStyle(targetColor, null).backgroundColor;
        }
      
      }else if(alpha>=60&&alpha<90&&colorPaletteStarted==true){

        if(side>300){
          console.log(globalColor);
          document.getElementById("realTime").innerText = "Select color: "+globalColor + " Degree is: " + alpha;
          document.getElementById("colorPalette").style.backgroundColor = globalColor;
          unTriggerColorPallette();
        }else{
          var targetColor;
          targetColor = (curColorGroup==1)?$(".group1").children().eq(2)[0]:(curColorGroup==4)?$(".group4").children().eq(2)[0]:$(".group3").children().eq(2)[0];
          targetColor.style.width=100+side+"px";
          targetColor.style.height=100+side+"px";
          targetColor.style.borderTopLeftRadius="0px";
          targetColor.style.borderTopRightRadius="0px";
          targetColor.style.borderBottomLeftRadius="0px";
          targetColor.style.borderBottomRightRadius=100+side+"0px";
          globalColor = window.getComputedStyle(targetColor, null).backgroundColor;
        }
      }else{
      
      }
} 