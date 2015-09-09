var leftFlag = false;
var rightFlag = false;
var pointable;
var interactionBox;
var normalizedPosition;	
var controllerOptions = {enableGestures: true, background: true};

Leap.loop(controllerOptions, {
	frame: function(frame){
		if(frame.hands.length == 1 && frame.pointables.length > 0){
			pointable = frame.pointables[2];
		    interactionBox = frame.interactionBox;
		    normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);
			/*for (var i = 0; i < frame.gestures.length; i++) {
				var gesture = frame.gestures[i];
				gestureString = "Gesture ID: " + gesture.id + ", "
				            + "type: " + gesture.type + ", "
				            + "state: " + gesture.state + ", "
				            + "hand IDs: " + gesture.handIds.join(", ") + ", "
				            + "pointable IDs: " + gesture.pointableIds.join(", ") + ", "
				            + "duration: " + gesture.duration + " &micro;s, ";
				document.getElementById("demo4").innerHTML = "<font color=\"red\">" + gestureString+"</font>";
				switch (gesture.type) {
					case "swipe":
						var gestureDir = gesture.direction;
						if(leftFlag == false && ((gestureDir[0] < 0 && gesture.state == "start") || normalizedPosition < 0.5)){
							leftFlag = true;
							api.prev();
						}
						else if(rightFlag == false && ((gestureDir[0] > 0 && gesture.state == "start")|| normalizedPosition > 0.5)){
							rightFlag = true;
							api.next();
						}
						break;
					default:
				}
	      	}*/
		}
	}
})

	.use('handEntry')

	//trigger hand in-out
	.on('handFound', function(){ 

	})
	.on('handLost',  function(){
		//leftFlag = false;
		//rightFlag = false;
		//document.getElementById("demo4").innerHTML = "<font color=\"red\">" + normalizedPosition[0]+"</font>";
		if(normalizedPosition[0] > 0.8){
			api.next();
		}
		else if(normalizedPosition[0] < 0.2){
			api.prev();
		}
	});

