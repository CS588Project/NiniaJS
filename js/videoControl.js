var canvasWhole;
var displayWhole;
var coords4;
var canvasWholeX;
var canvasWholeY;
var initDistance;

$(document).ready(function(){
  gSpeedMax = 0;
  openvideo = false;
  handOut();
});

function videoControl(frame){	  
  if(frame.hands.length == 1 && frame.pointables.length > 0){    
    //Get a pointable and normalize the tip position
    var pointable = frame.pointables[2];
    var interactionBox = frame.interactionBox;
    var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);

    canvasWholeX = window.innerWidth * normalizedPosition[0];
    canvasWholeY = window.innerHeight * (1 - normalizedPosition[1]);

    if(canvasWholeY < 10 && openvideo == false){
    	openVideo();
    }
    if(canvasWholeY > window.innerHeight - 10 && openvideo == true){
    	openVideo();
    }

   	handControl(null, canvasWholeX, canvasWholeY);
  }
}

var preScrollX,preScrollY;
var posX = 0, posY = 0;
var xBoundry, yBoundry;
var scrPos;

$(document).mousemove(function(event){handControl(event);}); 

//control function; event means mouse, no-event means Leap;
function handControl(e, leapX, leapY){
	var grid = window.screen.width/video_num;
    if(e != null){
        //console.log("X_not_leap:" + e.pageX); 
    }
    else{
        //console.log("X_leap:" + leapX); 
    }
    preScrollX = e!=null ? e.pageX : leapX;
    preScrollY = e!=null ? e.pageY : leapY;

    if(firstTimeIn) {
        scrPos = (e!=null ? e.pageX : leapX);
        firstTimeIn = false;
        return;
    }

    if(leftOrRight == 0) {
        if((e!=null ? e.pageX : leapX) >= (scrPos + grid)) {
            leftOrRight = 2; // right
            if(!openvideo) moveToIndex(flowSpeed);
            scrPos = (e!=null ? e.pageX : leapX);
            return;
        }
        if((e!=null ? e.pageX : leapX) <= (scrPos - grid)) {
            leftOrRight = 1; // left
            scrPos = (e!=null ? e.pageX : leapX);
            if(!openvideo) moveToIndex(-flowSpeed);
            return;
        }
        return;
    }
    else if(leftOrRight == 1) { // left
        if((e!=null ? e.pageX : leapX) >= scrPos) {
            scrPos = (e!=null ? e.pageX : leapX);
            return;
        }
        if((e!=null ? e.pageX : leapX) <= (scrPos - grid)) {
            scrPos = (e!=null ? e.pageX : leapX);
            if(!openvideo) moveToIndex(-flowSpeed);
            return;
        }
        return;
    }
    else { // right
        if((e!=null ? e.pageX : leapX) <= scrPos) {
            scrPos = (e!=null ? e.pageX : leapX);
            return;
        }
        if((e!=null ? e.pageX : leapX) >= (scrPos + grid)) {
            scrPos = (e!=null ? e.pageX : leapX);
            if(!openvideo) moveToIndex(flowSpeed);
            return;
        }
        return;
    }
}
