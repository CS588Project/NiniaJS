// Setup Leap loop with frame callback function
var controllerOptions = {enableGestures: true};

Leap.loop(controllerOptions, function(frame) {
  // Body of callback function
})

var frameString = "Frame ID: " + frame.id  + "<br />"
                + "Timestamp: " + frame.timestamp + " &micro;s<br />"
                + "Hands: " + frame.hands.length + "<br />"
                + "Fingers: " + frame.fingers.length + "<br />"
                + "Tools: " + frame.tools.length + "<br />"
                + "Gestures: " + frame.gestures.length + "<br />";