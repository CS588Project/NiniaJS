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
  if (frame.hands.length > 1) {
        console.warn("TWO HANDS!!");
        var hand_0 = frame.hands[0];
        var hand_1 = frame.hands[1];
        
        var pointable_0;
        var pointable_1;

        var interactionBox;
        var normalizedPosition_0;
        var normalizedPosition_1;

        if(hand_0.pointables.length > 0 && hand_1.pointables.length > 0){
            pointable_0 = hand_0.pointables[2];
            pointable_1 = hand_1.pointables[2];
            interactionBox = frame.interactionBox;
            normalizedPosition_0 = interactionBox.normalizePoint(pointable_0.tipPosition, true);
            normalizedPosition_1 = interactionBox.normalizePoint(pointable_1.tipPosition, true);
        }

        // Convert the normalized coordinates to span the canvas
        canvasWholeX_0 = window.innerWidth * normalizedPosition_0[0];
        canvasWholeY_0 = window.innerHeight * (1 - normalizedPosition_0[1]);

        canvasWholeX_1 = window.innerWidth * normalizedPosition_1[0];
        canvasWholeY_1 = window.innerHeight * (1 - normalizedPosition_1[1]);

        canvasWholeX_0 = canvasWholeX_0.toFixed(1);
        canvasWholeY_0 = canvasWholeY_0.toFixed(1);
        canvasWholeX_1 = canvasWholeX_1.toFixed(1);
        canvasWholeY_1 = canvasWholeY_1.toFixed(1);

        var distanceX = Math.abs(canvasWholeX_0 - canvasWholeX_1);
        var distanceY = Math.abs(canvasWholeY_0 - canvasWholeY_1);
        var distance = Math.sqrt(distanceY*distanceY + distanceX*distanceX);
        distance = distance.toFixed(1);

      if(distance < 200){
        if(openvideo) openVideo();
        return;
      }
  }  

  if(frame.hands.length == 1 && frame.pointables.length > 0){    
    //Get a pointable and normalize the tip position
    var pointable = frame.pointables[2];
    var interactionBox = frame.interactionBox;
    var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);

    canvasWholeX = window.innerWidth * normalizedPosition[0];
    canvasWholeY = window.innerHeight * (1 - normalizedPosition[1]);

    if(canvasWholeY < 50 && openvideo == false){
    	openVideo();
    }
    if(canvasWholeY > window.innerHeight - 50 && openvideo == true){
    	//openVideo();
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
