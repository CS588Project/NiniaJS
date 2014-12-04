var canvasWhole;
var displayWhole;
var coords4;
var gSpeedMax;
var canvasWholeX;
var canvasWholeY;
var toFullImgFlag;
var firstTwoHandsFlag = true;
var initDistance;
var isScalingFirstFlag = true;

$(document).ready(function(){
  gSpeedMax = 0;
  toFullImgFlag = false;
});

function galleryControl(frame){
		if(tutorialState=="end"){
			if (frame.hands.length > 1 && imgToFullScreen == true) {
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
		
			if(distance < 200 && isScalingFirstFlag == false){
				console.warn("isScalingFlag: " + isScalingFlag);
				toSmallImg();
				return;
				}
				if(firstTwoHandsFlag == true){
					firstTwoHandsFlag = false;
					initDistance = distance;
				}
		
				//image scale rate
				var scaleRate = distance/initDistance;
				scaleRate = scaleRate.toFixed(2);
				if(scaleRate < 1){
					scaleRate = 1;
				}
				toScaleImg(scaleRate);
				
				//for debug output
				coords4 = "x0: "+canvasWholeX_0 + "  y0: "+canvasWholeY_0 + "  x1: "+canvasWholeX_1 + "  y1: "+canvasWholeY_1;
				coords4 += "  initDistance: " + initDistance + "  distance: " + distance + "  scaleRate: " + scaleRate;    }
			if(frame.hands.length == 1 && frame.pointables.length > 0){
				firstTwoHandsFlag = true;
				twoHandsFlag = false;
				console.warn("ONE HAND!!");
				
				//Get a pointable and normalize the tip position
				var pointable = frame.pointables[2];
				var interactionBox = frame.interactionBox;
				var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);
		
				canvasWholeX = window.innerWidth * normalizedPosition[0];
				canvasWholeY = window.innerHeight * (1 - normalizedPosition[1]);
			
				if(canvasWholeY < 50 && imgToFullScreen == false && isScalingFlag == false){
					toFullImg();
				}
				if(canvasWholeY > window.innerHeight - 50 && imgToFullScreen == true && isScalingFlag == false){
					toSmallImg();
				}
		
				handControl(null, canvasWholeX, canvasWholeY);
			}
	}else{
		console.log("tutorial animation");
		tutorialAnimation(frame);
	}
}

function tutorialAnimation(frame){
	
		if(tutorialState=="start"){
			console.log(tutorialState);
			if(tutorial_idx==1){
				if(frame.pointables.length > 0){
					var touchDistance = frame.pointables[1].touchDistance;
					if(touchDistance<0){
					
						setTimeout(function(){nextTutorial();}, 1000);
						tutorialState = "wave";
					}			
				}
			}
		}else if(tutorialState=="wave"){
			console.log(tutorialState);
			if(tutorial_idx==2){
				if (frame.hands.length > 0){
					frame.hands.forEach(function(hand){
						var touchDistance = frame.pointables[1].touchDistance;
						if(touchDistance<0){
								setTimeout(function(){nextTutorial();}, 1000);
								tutorialState = "flipup";
						}
					});
				}
			}
		}else if(tutorialState=="flipup"){
			console.log(tutorialState);
			if(tutorial_idx==3){
				if (frame.hands.length > 0){
					frame.hands.forEach(function(hand){
						var touchDistance = frame.pointables[1].touchDistance;
						if(touchDistance<0){
								setTimeout(function(){nextTutorial();}, 1000);
								tutorialState = "scale";
						}
					});
				}
			}
		}else if(tutorialState=="scale"){
			console.log(tutorialState);
			if(tutorial_idx==4){
				if (frame.hands.length > 0){
					frame.hands.forEach(function(hand){
						var touchDistance = frame.pointables[1].touchDistance;
						if(touchDistance<0){
								setTimeout(function(){nextTutorial();}, 1000);
								tutorialState = "move";
						}
					});
				}	
			}
		}else if(tutorialState=="move"){
			console.log(tutorialState);
			//setTimeout(function(){nextTutorial();}, 1000);
			tutorialState = "end";
		}
	
		
	}
