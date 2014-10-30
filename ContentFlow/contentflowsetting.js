var w = window.innerWidth;
var h = window.innerHeight;

$(document).ready(function() {
    var myNewFlow = new ContentFlow('theflow', 
    	{endOpacity:0.5, visibleItems:4, relativeItemPosition:'center top', maxItemHeight:0.5*h, flowSpeedFactor:0.5} ) ;
    //can use flowSpeedFactor to change the speed
});