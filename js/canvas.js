
//global variables
var canvas = null, ctx = null; // canvas context
var drawStarted = false; 
var globalGesture = null;   
var cur_state="IDLE",prev_state=null;
var eraseStarted = false;
var colorPaletteStarted = false;

var globalColor = "gray";
var globalThick = 5;

var iniColorGroup1 = 0,iniColorGroup4 = 90, iniColorGroup3 = 180, iniColorGroup2 = 270, stepAngle = 0, curColorGroup = 1;
var reg1,reg2 = true;
var circleDirection;
var leapValid = null;
var prevState = "",prevState2 = "";
var cursorX, cursorY;
var cursorLeapMotion = null;
var globalHand = "right"; //default;
var gestureFrameCount = 0;

/************* For Real Time Output ***********************/
var distanceDisplay;
var cursorXY;
var handType;
/**************** For Real Time Output*********************/
    
/*    
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
*/

$(document).ready(function() {  
  $(document.body).css({
    "overflow-x":"hidden",
    "overflow-y":"hidden"
  });
  $(window).resize(resizeCanvas);
  resizeCanvas();
  function resizeCanvas() {
    $("#myCanvas").attr("width", $(window).get(0).innerWidth);
    $("#myCanvas").attr("height", $(window).get(0).innerHeight);
  //  console.log($(window).get(0).innerHeight);
  };
  //console.log($(window).get(0).innerWidth);
    /************* For Real Time Output ***********************/
    distanceDisplay = document.getElementById("distance");
    cursorXY = document.getElementById("cursorXY");
    handType = document.getElementById("handType");
    /************* For Real Time Output ***********************/
  //Initialize the drawing canvas
  initialDrawingCanvas();
  //Initialize the color palette
  initialColorPalette();
  });
  
  
  
  // Setup Leap loop with frame callback function
  var controllerOptions = {enableGestures: true};

  Leap.loop(controllerOptions, function(frame) {
  if(frame.pointables.length > 0){
    getLeapPosition(leapValid,frame);           
    overlappingDetection();
    drawingANDerasing(frame);
    if(colorPaletteStarted==true){
      if( Math.sqrt(cursorX*cursorX+cursorY*cursorY)>100 )
        mouseMove(null,cursorX,cursorY);
    }
    
    gestureDetection(frame);
  
  }else{
    leapValid=false;
    cursorLeapMotion.style.visibility="hidden";
    resetBrushMenu();
    resetColorPallette();
  } 
  })
    
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
          var brushTypeButton = $( '#brushType' )[0]
          var brushThicknessButton = $('#brushThickness')[0];
          var crayon1Button = $( '#crayon1' )[0];
          var crayon2Button = $( '#crayon2' )[0];
          var crayon3Button = $( '#crayon3' )[0];
          var smallButton = $( '#small' )[0];
          var mediumButton = $( '#medium' )[0];
          var largeButton = $( '#large' )[0];
          var brushChoiceButton = $( '#brushChoice' );
          
          var crayonRed = document.getElementById('crayonRed');
          var crayonBlue = document.getElementById('crayonBlue');
          var crayonYellow = document.getElementById('crayonYellow');
          
          
          if(globalHand == "left")
            return;
            
          if(overlaps( leapCursor, colorPalette )==true){
          
            colorPaletteStarted = true; 
            colorPalette.style.borderRightStyle="solid";
            colorPalette.style.borderBottomStyle="solid";
            
          }else if(overlaps( leapCursor,brushTypeButton )==true){
          
            $( '#brushType' ).addClass("blur");
            document.getElementById("brushTypeHover").style.zIndex=11;
            $( '#brushThickness' ).removeClass("blur");
            document.getElementById("brushThicknessHover").style.zIndex=9;
            console.log("collide with brush type");
            closeBrushThicknessL2();
            document.getElementById('small').innerText = "";
            document.getElementById('medium').innerText = "";
            document.getElementById('large').innerText = "";
              
            openBrushTypeL2();
            if(prevState == "brushTypeL2" || prevState == "brushThicknessL2"){
              brushChoiceButton.css({"width":"0px"});
              document.getElementById("brushClip").style.width =  "0px";
            }
            
            document.getElementById("brushType").style.opacity=1.0;
            document.getElementById("brushThickness").style.opacity=1.0;
            
            $("#crayon1").text("Brush Type 1");
            $("#crayon2").text("Brush Type 2");
            $("#crayon3").text("Brush Type 3");       
            document.getElementById('crayon1').style.color="white";
            document.getElementById('crayon2').style.color="white";
            document.getElementById('crayon3').style.color="white";
            
          }else if(overlaps(leapCursor,brushThicknessButton)==true){
          
            console.log("collide with brush thickness");
            $( '#brushThicknessButton' ).addClass("blur");
            document.getElementById("brushThicknessHover").style.zIndex=11;
            $( '#brushType' ).removeClass("blur");
            document.getElementById("brushTypeHover").style.zIndex=9;
        
            console.log("collide with brush thickness");
            closeBrushTypeL2();
            document.getElementById('crayon1').innerText = "";
            document.getElementById('crayon2').innerText = "";
            document.getElementById('crayon3').innerText = "";
            openBrushThicknessL2();
            if(prevState == "brushThicknessL2"||prevState == "brushTypeL2"){
              brushChoiceButton.css({"width":"0px"});
              document.getElementById("brushClip").style.width =  "0px"
            }
    
            $("#small").text("Brush Small");
            $("#medium").text("Brush Medium");
            $("#large").text("Brush Large");        
            document.getElementById('small').style.color="white";
            document.getElementById('medium').style.color="white";
            document.getElementById('large').style.color="white";
            
          }else{
            if(overlaps(leapCursor,crayon1Button)==true){
              brushChoiceButton.css({"width":"25px","top":"333px"});
                document.getElementById("brushClip").style.width =  cursorX-100+"px"
                document.getElementById("brushClip").style.top = "333px";
                document.getElementById("brushClip").style.backgroundColor = "rgb(167,71,8)";
              prevState2 = "crayon1";
              prevState = "brushTypeL2";
            }else if(overlaps(leapCursor,crayon2Button)==true){
              
              brushChoiceButton.css({"width":"25px","top":"433px"});
                document.getElementById("brushClip").style.width =  cursorX-100+"px"
                document.getElementById("brushClip").style.top = "433px";
                document.getElementById("brushClip").style.backgroundColor = "rgb(167,71,8)";
              prevState2 = "crayon2";
              prevState = "brushTypeL2";
            }else if(overlaps(leapCursor,crayon3Button)==true){
              brushChoiceButton.css({"width":"25px","top":"533px"});
                document.getElementById("brushClip").style.width =  cursorX-100+"px"
                document.getElementById("brushClip").style.top = "533px";
                document.getElementById("brushClip").style.backgroundColor = "rgb(167,71,8)";
              prevState2 = "crayon3";
              prevState = "brushTypeL2";
            }else if(overlaps(leapCursor,smallButton)==true){
              brushChoiceButton.css({"width":"25px","top":"333px"});
                document.getElementById("brushClip").style.width =  cursorX-100+"px"
                document.getElementById("brushClip").style.top = "333px";
                document.getElementById("brushClip").style.backgroundColor = "rgb(167,71,8)";
              prevState2 = "small";
              prevState = "brushThicknessL2";
            }else if(overlaps(leapCursor,mediumButton)==true){
              brushChoiceButton.css({"width":"25px","top":"433px"});
              
                document.getElementById("brushClip").style.width =  cursorX-100+"px"
                document.getElementById("brushClip").style.top = "433px";
                document.getElementById("brushClip").style.backgroundColor = "rgb(167,71,8)";
              prevState2 = "medium";
              prevState = "brushThicknessL2";
            }else if(overlaps(leapCursor,largeButton)==true){
              brushChoiceButton.css({"width":"25px","top":"533px"});
              
                document.getElementById("brushClip").style.width =  cursorX-100+"px"
                document.getElementById("brushClip").style.top = "533px";
                document.getElementById("brushClip").style.backgroundColor = "rgb(167,71,8)";
              prevState2 = "large";
              prevState = "brushThicknessL2";
            }else{    
              if( prevState == "brushTypeL2" && cursorX>200){
                if(prevState2 == "crayon1"){
                  console.log("crayon1");
                  var pat=ctx.createPattern(crayonRed,"repeat");
                  globalColor = pat;
                }else if(prevState2 == "crayon2"){
                  console.log("crayon2");
                  var pat=ctx.createPattern(crayonBlue,"repeat");
                  globalColor = pat;
                }else if(prevState2 == "crayon3"){
                  console.log("crayon3");
                  var pat=ctx.createPattern(crayonYellow,"repeat");
                  globalColor = pat;
                }
              }else if( prevState == "brushThicknessL2" && cursorX>200 ){
                if(prevState2 == "small")
                  globalThick = 5;
                else if(prevState2 == "medium")
                  globalThick = 10;
                else if(prevState2 == "large")
                  globalThick = 20;
              }
              resetBrushMenu();
            }
          }
    }
    
    function getLeapPosition(leapValid,frame){
      if(leapValid==false){
        leapValid = true;
        cursorLeapMotion.style.left = "500px";
        cursorLeapMotion.style.top = "500px";
        cursorLeapMotion.style.visibility="visible";
      }
      var pointable = frame.pointables[1];
      var interactionBox = frame.interactionBox;
      var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);
        cursorX = window.innerWidth * normalizedPosition[0];
        cursorY = window.innerHeight * (1 - normalizedPosition[1]);
        cursorLeapMotion.style.left = cursorX/window.innerWidth*100+"%";
        cursorLeapMotion.style.top = cursorY/window.innerHeight*100+"%";
        cursorXY.innerText = cursorX + "  " + cursorY;
    }
      
    function drawingANDerasing(frame){
        if (frame.hands.length > 0){
          frame.hands.forEach(function(hand){
            if(hand.type == "left"){
              handType.innerText = " Left";
              globalHand = "left";
              leftHandSetting();
            }else if(hand.type == "right"){
              handType.innerText = " Right";
              globalHand = "right";
              rightHandSetting();
            }
            if( hand.pinchStrength==0 ){
              globalGesture = "Erase";
              cursorLeapMotion.innerHTML = "Erase Cursor";
            }
            else{
              globalGesture = "Draw";
              cursorLeapMotion.innerHTML = "Draw Cursor";
            }
          });
        
          if( globalGesture=="Erase" ){
            var touchDistance = frame.pointables[1].touchDistance;
            prev_state = cur_state;
            if(touchDistance<0){
              cur_state = "ERASE_ON";
              cursorLeapMotion.style.backgroundColor="rgb(255,0,0)";
              if(prev_state=="ERASE_OFF"||prev_state=="DRAW_ON"){
                ctx.beginPath();
                ctx.strokeStyle="black";
                ctx.lineWidth=globalThick;
                drawStarted = true;
              }   
              drawStarted==false?leapTouchDown(cursorX,cursorY):leapTouchMove(cursorX,cursorY);
            }else{
              leapTouchUp();
              cur_state = "ERASE_OFF";
              cursorLeapMotion.style.backgroundColor="rgb(0,255,0)";
            }
          }else if( globalGesture=="Draw" ){
            var touchDistance = frame.pointables[1].touchDistance;
              prev_state = cur_state;
            if(touchDistance<0){
              cur_state = "DRAW_ON";
              cursorLeapMotion.style.backgroundColor="rgb(255,0,0)";
              if(prev_state=="DRAW_OFF" || prev_state=="ERASE_ON"){
                ctx.beginPath();
                ctx.strokeStyle=globalColor;
                ctx.lineWidth=globalThick;
                drawStarted = true;
              }
              drawStarted==false?leapTouchDown(cursorX,cursorY):leapTouchMove(cursorX,cursorY);
            }else{
              cur_state = "DRAW_OFF";
              cursorLeapMotion.style.backgroundColor="rgb(0,255,0)";
              leapTouchUp();
            }
            distanceDisplay.innerText = touchDistance;
          }
        }
      } 
  
        
    function leapTouchDown(leapX,leapY){
    ctx.beginPath(); 
    drawStarted = true;  
    }
    function leapTouchMove(leapX,leapY){
    ctx.lineTo(leapX, leapY);  
    ctx.stroke();  
    }
    function leapTouchUp(){
    drawStarted = false;
    }
      
    function unTriggerColorPallette(){
        colorPaletteStarted = false;
        resetColorPallette();
    }


    
    function resetColorPallette(){
    
        var resetColor1,resetColor2,resetColor3;
          resetColor1 = (curColorGroup==1)?$(".group1").children().eq(0)[0]:(curColorGroup==4)?$(".group4").children().eq(0)[0]:(curColorGroup==3)?$(".group3").children().eq(0)[0]:$(".group2").children().eq(0)[0];
          resetColor1.style.width=200+"px";
          resetColor1.style.height=200+"px";
          resetColor1.style.borderTopLeftRadius="0px";
          resetColor1.style.borderTopRightRadius="0px";
          resetColor1.style.borderBottomLeftRadius="0px";
          resetColor1.style.borderBottomRightRadius="200px";
          
          resetColor2 = (curColorGroup==1)?$(".group1").children().eq(1)[0]:(curColorGroup==4)?$(".group4").children().eq(1)[0]:(curColorGroup==3)?$(".group3").children().eq(1)[0]:$(".group2").children().eq(1)[0];;
          resetColor2.style.width=200+"px";
          resetColor2.style.height=200+"px";
          resetColor2.style.borderTopLeftRadius="0px";
          resetColor2.style.borderTopRightRadius="0px";
          resetColor2.style.borderBottomLeftRadius="0px";
          resetColor2.style.borderBottomRightRadius="200px";
          
          resetColor3 = (curColorGroup==1)?$(".group1").children().eq(2)[0]:(curColorGroup==4)?$(".group4").children().eq(2)[0]:(curColorGroup==3)?$(".group3").children().eq(2)[0]:$(".group2").children().eq(2)[0];;
          resetColor3.style.width=200+"px";
          resetColor3.style.height=200+"px";
          resetColor3.style.borderTopLeftRadius="0px";
          resetColor3.style.borderTopRightRadius="0px";
          resetColor3.style.borderBottomLeftRadius="0px";
          resetColor3.style.borderBottomRightRadius="200px";
          
          document.getElementById("colorPalette").style.borderRightStyle="none";
          document.getElementById("colorPalette").style.borderBottomStyle="none";
          colorPaletteStarted = false;
    
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
              //  console.log("click-1");
              }
              else if(curColorGroup==4){
                //document.getElementById("colorPaletteSub2").style.zIndex = document.getElementById("colorPaletteSub3").style.zIndex;
                document.getElementById("colorPaletteSub2").style.zIndex = 4;
              //  console.log("click-4");
              }else if(curColorGroup==3){
                //document.getElementById("colorPaletteSub1").style.zIndex = document.getElementById("colorPaletteSub2").style.zIndex;
                document.getElementById("colorPaletteSub1").style.zIndex = 4;
              //  console.log("click-3");
              }else if(curColorGroup==2){
                //document.getElementById("colorPaletteSub4").style.zIndex = document.getElementById("colorPaletteSub1").style.zIndex + 1;
                document.getElementById("colorPaletteSub4").style.zIndex = 4;
                document.getElementById("colorPaletteSub3").style.zIndex = 3;
                document.getElementById("colorPaletteSub2").style.zIndex = 3;
                document.getElementById("colorPaletteSub1").style.zIndex = 3;
              //  console.log("click-2");
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

    function openBrushTypeL2(){
      $(".brushTypeL2").eq(0).css("width","100px");
      $(".brushTypeL2").eq(1).css("width","100px");
      $(".brushTypeL2").eq(2).css("width","100px");
    }
    
    function closeBrushTypeL2(){
      $(".brushTypeL2").eq(0).css("width","0px");
      $(".brushTypeL2").eq(1).css("width","0px");
      $(".brushTypeL2").eq(2).css("width","0px");
    }
    function openBrushThicknessL2(){
      $(".brushThicknessL2").eq(0).css("width","100px");
      $(".brushThicknessL2").eq(1).css("width","100px");
      $(".brushThicknessL2").eq(2).css("width","100px");
    }
    function closeBrushThicknessL2(){
      $(".brushThicknessL2").eq(0).css("width","0px");
      $(".brushThicknessL2").eq(1).css("width","0px");
      $(".brushThicknessL2").eq(2).css("width","0px");    
    }
  
    function resetBrushMenu(){
      $( '#brushType' ).removeClass("blur");
      document.getElementById("brushTypeHover").style.zIndex=9;
      $( '#brushThickness' ).removeClass("blur");
      document.getElementById("brushThicknessHover").style.zIndex=9;
      prevState = "";
      prevState2 = "";
      $( '#brushChoice' ).css({"width":"0px"});
      $( '#brushClip' ).css({"width":"0px"});
      closeBrushTypeL2();
      closeBrushThicknessL2();
      document.getElementById('crayon1').innerText = "";
      document.getElementById('crayon2').innerText = "";
      document.getElementById('crayon3').innerText = "";
      document.getElementById('small').innerText = "";
      document.getElementById('medium').innerText = "";
      document.getElementById('large').innerText = "";
    }

    function leftHandSetting(){
    

      $(".group1Right").children().eq(0).addClass("colorDegree270Right");
      $(".group1Right").children().eq(1).addClass("colorDegree300Right");
      $(".group1Right").children().eq(2).addClass("colorDegree330Right");
      $( '#colorPaletteRight' ).addClass("colorPaletteRight");
      
      $("div.menuHolderRight > div").css("visibility", "visible");    
      $("div.menuHolderRight > div").css("transition", "width 2s");     
      $("div.menuHolder > div").css("transition", "width 0.00s");     
      $("div.menuHolder > div").css("visibility", "hidden");

      var temp1 = 1365 - 100 + "px";
      var temp2 = 1365 - 200 + "px";
      $( '#brushType' ).css("left",temp1);
      $( '#brushThickness' ).css("left",temp1);
      $( '#brushTypeHover' ).css("left",temp1);
      $( '#brushThicknessHover' ).css("left",temp1);
      $( '#crayon1' ).css("left",temp2);
      $( '#crayon2' ).css("left",temp2);
      $( '#crayon3' ).css("left",temp2);
      $( '#small' ).css("left",temp2);
      $( '#medium' ).css("left",temp2);
      $( '#large' ).css("left",temp2);
      
    }
    
    function rightHandSetting(){
      $("div.menuHolder > div").css("visibility", "visible");
    //  $("div.menuHolder > div").css("transition", "width 2s");    
      $("div.menuHolderRight > div").css("transition", "width 0.00s");      
      $("div.menuHolderRight > div").css("visibility", "hidden");     
      
      $( '#brushType' ).css("left","0px");
      $( '#brushThickness' ).css("left","0px");
      $( '#brushTypeHover' ).css("left","0px");
      $( '#brushThicknessHover' ).css("left","0px");
      $( '#crayon1' ).css("left","100px");
      $( '#crayon2' ).css("left","100px");
      $( '#crayon3' ).css("left","100px");
      $( '#small' ).css("left","100px");
      $( '#medium' ).css("left","100px");
      $( '#large' ).css("left","100px");
    }
    
    function initialColorPalette(){
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
      $( '#colorPalette' ).addClass("colorPaletteLeft");
    }
    
    function initialDrawingCanvas(){

      cursorLeapMotion = document.getElementById("leapCursor");
      cursorLeapMotion.style.visibility="hidden";
      leapValid = false;
      
      canvas = document.getElementById("myCanvas")
      //canvas context
      ctx=document.getElementById("myCanvas").getContext("2d");
      ctx.fillRect(0,0,$(window).get(0).innerWidth,$(window).get(0).innerHeight);
      ctx.beginPath();  
      ctx.globalCompositeOperation = "source-over"; 
    }
    
    function gestureDetection(frame){
    
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
              if(drawStarted==false)
                rotateColorPalette2(gesture,frame);
                //rotateColorPalette(gesture,frame);
            break;
            case "swipe":
            /*
            gestureString += "start position: " + vectorToString(gesture.startPosition) + " mm, "
                    + "current position: " + vectorToString(gesture.position) + " mm, "
                    + "direction: " + vectorToString(gesture.direction, 1) + ", "
                    + "speed: " + gesture.speed.toFixed(1) + " mm/s";
            */
            break;
            
            case "screenTap":
              console.log("screenTap");
            break;
            
            case "keyTap":
              console.log("keyTap");
              if(drawStarted==false)
                clearDrawingCanvas();
            break;
            default:
              gestureFrameCount = 0;
              //console.log(gestureFrameCount);
          }
          gestureString += "<br />";
        }
      }else{
        gestureFrameCount = 0;
        //console.log(gestureFrameCount);
      }
    }
    

    function rotateColorPalette(gesture,frame){
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
        //console.log("Circle Ends");           
        var hand = frame.hands[0];        
        if(circleDirection=="clockwise"&&drawStarted==false&&hand.pinchStrength>0){
          increaseColorGroup();
        }
        else if(circleDirection=="counterclockwise"&&drawStarted==false&&hand.pinchStrength>0){
          decreaseColorGroup();
        }
      }
      
    }
    
    function clearDrawingCanvas(){
      ctx.fillStyle="black";
      ctx.fillRect(0,0,$(window).get(0).innerWidth,$(window).get(0).innerHeight);
    }
    
    function rotateColorPalette2(gesture,frame){
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
            //  console.log("clockwise");
              gestureFrameCount++;
            } else {
              //Do counterclockwise stuff
            //  console.log("counterclockwise");
              circleDirection = "counterclockwise";
              gestureFrameCount++;
            }
        }
      }
      
        //console.log("Circle Ends");           
        var hand = frame.hands[0];        
        if(gestureFrameCount>=75&&circleDirection=="clockwise"&&drawStarted==false&&hand.pinchStrength>0){
          increaseColorGroup();
        //  console.log(gestureFrameCount);
          gestureFrameCount = 0;
          
        }
        else if(gestureFrameCount>=75&&circleDirection=="counterclockwise"&&drawStarted==false&&hand.pinchStrength>0){
          decreaseColorGroup();
        //  console.log(gestureFrameCount);
          gestureFrameCount = 0;
        }
      
    
    }