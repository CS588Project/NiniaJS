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
		/*******************************************************/
		
		
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
					ctx.strokeStyle="gray";
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
					//console.log("Prev state: DRAW_OFF ");
					ctx.beginPath();
					ctx.strokeStyle="black";
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
		/*******************************************************/
		//console.log(cur_state);				
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
				keyTapNum++;
				if(globalGesture=="Erase"&&!timerStarted){
					timer = self.setInterval("checkKeyTapNum()",2000);
					timerStarted = true;
				}
			
				console.log("circle");
				/*
				gestureString += "center: " + vectorToString(gesture.center) + " mm, "
								+ "normal: " + vectorToString(gesture.normal, 2) + ", "
								+ "radius: " + gesture.radius.toFixed(1) + " mm, "
								+ "progress: " + gesture.progress.toFixed(2) + " rotations";
				*/
				break;
				/*
				case "swipe":
				gestureString += "start position: " + vectorToString(gesture.startPosition) + " mm, "
								+ "current position: " + vectorToString(gesture.position) + " mm, "
								+ "direction: " + vectorToString(gesture.direction, 1) + ", "
								+ "speed: " + gesture.speed.toFixed(1) + " mm/s";
				break;
				case "screenTap":
				*/
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
		//console.log(gestureString)
	}
}