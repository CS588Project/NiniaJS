//global var
var triggerFlag;
var menuClickFlag;
var firstClickFlag;//firstClickFlag!///
var tutorialState;

$(document).ready(function(){
  triggerFlag = false;
  firstClickFlag = true;
  $(".blur").addClass("disableBlur");
  var canvasElement=document.getElementById("control_canvas");
  var displayArea=canvasElement.getContext("2d");
  $('.trigger').on('dblclick', function(e){
    //console.log("aaaaaaaa");
    if(!triggerFlag) showHelp();
    else hideHelp();
    e.preventDefault();
    $.popcircle('#pops2',{
              spacing:'150px',
              type:'full', // full, half, quad
              offset:0, // 0, 1, 2, 3, 4, 5, 6, 7 or 5.1
              ease:'easeOutQuad',
              time:'fast' // slow, fast, 1000
              }
           );
  }); 

  /********************************************************
  * This is the actual example part where we call grabStrength
  *****************************************************/
  // Set up the controller:
  var controllerOptions = {enableGestures: true, background: true};
  Leap.loop(controllerOptions, {
    hand: function(hand){
      //var output = document.getElementById("output"),
      //progress = document.getElementById("progress");
      //output.innerHTML = hand.grabStrength.toPrecision(2);
      //progress.style.width = hand.grabStrength * 100 + '%';
      //progress.style.width = hand.grabStrength * 100 + '%';
      //firstClickFlag!///
      if(firstClickFlag == true && hand.grabStrength < 0.8){
        firstClickFlag = false;
      }
      ////////////////////
       if(hand.confidence> 0.5 && hand.grabStrength >= 0.9 && triggerFlag == false && firstClickFlag == false &&
        tutorialState!="start" &&  
        tutorialState!="poke" &&
        tutorialState!="draw" &&
        tutorialState!="erase" &&
        tutorialState!="colorPalette" &&
        tutorialState!="wave" &&
        tutorialState!="flipup" &&
        tutorialState!="scale" &&
        tutorialState!="move" 
      ){
        $('.trigger').trigger("dblclick");
        //triggerFlag = true;
      }
      if(hand.confidence > 0.5 && hand.grabStrength < 0.9 && triggerFlag == true){
        $('.trigger').trigger("dblclick");
        //triggerFlag = false;
      }
    },
    frame: function(frame){
      if(frame.pointables.length > 0){
        canvasElement.width = canvasElement.width; //clear
        
        //Get a pointable and normalize the tip position
        var pointable = frame.pointables[0];
        var interactionBox = frame.interactionBox;
        var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);
        
        // Convert the normalized coordinates to span the canvas
        var canvasX = canvasElement.width * normalizedPosition[0];
        var canvasY = canvasElement.height * (1 - normalizedPosition[1]);
        //we can ignore z for a 2D context
        
        //displayArea.strokeText("(" + canvasX.toFixed(1) + ", " + canvasY.toFixed(1) + ")", canvasX, canvasY);
        var coords4 = "canvasX: " + canvasX + ", canvasY: " + canvasY + ", canvasWidth:" 
                      + canvasElement.width+" canvasHeight:"+ canvasElement.height;
        //document.getElementById("demo4").innerHTML = "<font color=\"red\">" + coords4+"</font>";
        centralPad(null, canvasX, canvasY);
      }

      if (document.title == "Ninia - Video"){
        videoControl(frame);
        //youtubeControl(frame);
      }
      else if(document.title == "Ninia - Gallery"){
        galleryControl(frame);
      }
      else if(document.title == "Ninia - Canvas"){
        canvasControl(frame);
      }
      else if(document.title == "Ninia - Slides"){
        pdfControl(frame);
      }
    }

  }).use('screenPosition', {
      scale: 1
  })
  .use('handEntry')
  //trigger hand in-out
  .on('handFound', function(){
      handOut();
  })
  .on('handLost',  function(){
    if (document.title == "Ninia - Video"){
      ;
    }
    else if(document.title == "Ninia - Gallery"){
      if(twoHandsFlag == true && isScalingFlag == true){
        isScalingFirstFlag = false;
      }
      console.log('hand lost'); 
      if(leftOrRight == 1 && canvasWholeX <=20 && !imgToFullScreen && twoHandsFlag == false){//left
        moveToIndex(-3);
      }
      else if(leftOrRight == 2 && canvasWholeX >= window.innerWidth -50 && !imgToFullScreen && twoHandsFlag == false){//right
        moveToIndex(3);
      }
    }
    else if(document.title == "Ninia - Canvas"){
      ;
    }
    else if(document.title == "Ninia - Slides"){
      ;
    } 
  })

  if(document.title == "Ninia - Welcome"){    
    Leap.loopController.use('riggedHand').use('playback', {
      recording: 'sample_gesture/leap-playback-recording-75fps.json.lz',
      pauseOnHand: true,
      requiredProtocolVersion: 6,
      offset: new THREE.Vector3(0,-50,0)
    });

    document.getElementById('help1').style.visibility = 'hidden';
    document.getElementById('help2').style.visibility = 'hidden';
    document.getElementById('help3').style.visibility = 'hidden';
    document.getElementById('help4').style.visibility = 'hidden';
    document.getElementById('help5').style.visibility = 'hidden';
    document.getElementById('help6').style.visibility = 'hidden';
  }
  /*********************************************************
  * End
  ****************************************************/
});

function handOut() {
    firstTimeIn = true;
    leftOrRight = 0;
    actLeftOrRight = 0;
    flowSpeed = 1;
}

function centralPad(event, leapCanvasX, leapCanvasY){
  var div_pos = $(".box").position();
  var divCX = div_pos.left;
  var divCY = div_pos.top;
  if(event != null){
    var cX = event.clientX;  
    var cY = event.clientY;
    var offsetx = cX - divCX;
    var offsety = cY - divCY;
  }
  else{
    var offsetx = leapCanvasX-200;
    var offsety = leapCanvasY-200;
  }
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
      lmsk.style.clip = "rect(0px, 400px, 400px, "+(200+offsetx)+"px)";
      lmsk.style.opacity = "0.9";
      if(offsetx < -190 && triggerFlag == true){
        lmsk.style.opacity = "0.0";
        $(".lefticon").animate({
          top:'-=25%', left:'-=25%', height:'+=50%', opacity:'0.0'},700, 
          function(){ location.href='./pdf.html';})
      }
    }
    else{
      rmsk.style.clip = "rect(0px, "+(offsetx+50)+"px, 400px, 0px)";
      rmsk.style.opacity = "0.9";
      if(offsetx > 190 && triggerFlag == true){
        rmsk.style.opacity = "0.0";
        $(".righticon").animate({
          top:'-=25%', left:'-=25%', height:'+=50%', opacity:'0.0'},700, 
          function(){ location.href='./video.html';})
      }
    }
  } 
  else{
    if(offsety <= 0){
      umsk.style.clip = "rect("+(200+offsety)+"px, 400px, 400px, 0px)";
      umsk.style.opacity = "0.9";
      if(offsety < -190 && triggerFlag == true){
        umsk.style.opacity = "0.0";
        $(".upicon").animate({
          top:'-=25%', left:'-=25%', height:'+=50%', opacity:'0.0'},700, 
          function(){ location.href='./gallery.html';})
      } 
    }
    else{
      dmsk.style.clip = "rect(0px, 400px, "+(50+offsety)+ "px, 0px)";
      dmsk.style.opacity = "0.9";
      if(offsety > 190 && triggerFlag == true){
        dmsk.style.opacity = "0.0";
        $(".downicon").animate({
          top:'-=25%', left:'-=25%', height:'+=50%', opacity:'0.0'},700, 
          function(){ location.href='./canvas.html';})
      }
    }
  }

  var coords1 = "offsetx: " + offsetx + ", offsety: " + offsety;
  var coords2 = "div_pos.left: " + divCX + ", div_pos.top: " + divCY;
  var coords3 = "event.clientX: " + cX + ", event.clientY: " + cY;
  //document.getElementById("demo").innerHTML = "<font color=\"red\">" + coords1+"</font>";
  //document.getElementById("demo2").innerHTML = "<font color=\"red\">" + coords2+"</font>";
  //document.getElementById("demo3").innerHTML = "<font color=\"red\">" + coords3+"</font>";
  cursor(event, leapCanvasX, leapCanvasY);
}

function cursor(event, leapCanvasX, leapCanvasY){
  var div_pos = $(".box").position();
  var divCX = div_pos.left;
  var divCY = div_pos.top;
  if(event != null){
    var cX = event.clientX;  
    var cY = event.clientY;
    var offsetx = cX - divCX;
    var offsety = cY - divCY;
  }
  else{
    var offsetx = leapCanvasX-200;
    var offsety = leapCanvasY-200;
  }

  var canvasElement=document.getElementById("control_canvas");
  var displayArea=canvasElement.getContext("2d");  //cursor
  if(triggerFlag){
    displayArea.beginPath();
    displayArea.clearRect(0,0,canvasElement.width,canvasElement.height);
    displayArea.fillStyle = 'rgba(200, 200, 200, 0.3)';
    displayArea.arc(offsetx+200, offsety+200, 20, 0, 2*Math.PI);
    displayArea.shadowColor = '#FFFFFF';
    displayArea.shadowBlur = 20;
    //displayArea.moveTo(offsetx+divCX, offsety+divCY);
    displayArea.fill();
    displayArea.closePath();
  }
  else{
    displayArea.clearRect(0,0,canvasElement.width,canvasElement.height);
  }
}

function showHelp(){
  var animate_time = 200;
  $("#help1").animate({ left:'2%', opacity:'1'},animate_time, function(){
    $("#help2").animate({ left:'2%', opacity:'1'},animate_time, function(){
      $("#help3").animate({ left:'2%', opacity:'1'},animate_time);
    });
  });

  $("#help4").animate({ right:'2%', opacity:'1'},animate_time, function(){
    $("#help5").animate({ right:'2%', opacity:'1'},animate_time, function(){
      $("#help6").animate({ right:'2%', opacity:'1'},animate_time);
    });
  });
}

function hideHelp(){
  var animate_time = 200;
  $("#help1").animate({ left:'-30%', opacity:'0'},animate_time, function(){
    $("#help2").animate({ left:'-30%', opacity:'0'},animate_time, function(){
      $("#help3").animate({ left:'-30%', opacity:'0'},animate_time);
    });
  });

  $("#help4").animate({ right:'-30%', opacity:'0'},animate_time, function(){
    $("#help5").animate({ right:'-30%', opacity:'0'},animate_time, function(){
      $("#help6").animate({ right:'-30%', opacity:'0'},animate_time);
    });
  });
}


function GetHttpRequest() 
{ 
    if ( window.XMLHttpRequest ) // Gecko 
        return new XMLHttpRequest() ; 
    else if ( window.ActiveXObject ) // IE 
        return new ActiveXObject("MsXml2.XmlHttp") ; 
} 

function AjaxPage(sId, url){ 
    var oXmlHttp = GetHttpRequest() ; 

    oXmlHttp.OnReadyStateChange = function()  { 
        if ( oXmlHttp.readyState == 4 ) 
        { 

            if ( oXmlHttp.status == 200 || oXmlHttp.status == 304 ) 

            { 

                IncludeJS( sId, url, oXmlHttp.responseText ); 

            } 

            else 

            { 

                alert( 'XML request error: ' + oXmlHttp.statusText + ' (' + oXmlHttp.status + ')' ) ; 

            } 

        } 

    } 



    oXmlHttp.open('GET', url, true); 

    oXmlHttp.send(null); 

} 



function IncludeJS(sId, fileUrl, source) 
{ 

    if ( ( source != null ) && ( !document.getElementById( sId ) ) ){ 

        var oHead = document.getElementsByTagName('HEAD').item(0); 

        var oScript = document.createElement( "script" ); 



        oScript.language = "javascript"; 

        oScript.type = "text/javascript"; 

        oScript.id = sId; 

        oScript.defer = true; 

        oScript.text = source; 



        oHead.appendChild( oScript ); 

    } 
} 