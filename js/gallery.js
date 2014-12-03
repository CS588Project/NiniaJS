var w = window.innerWidth;
var h = window.innerHeight;
var fullMoveFlag = false; //don't continuously navigate under full screen mode
//var current =1;
var imgToFullScreen = false;
//var imgNo;
//var state = 10;
// var handInOut;
var leftOrRight = 0; // 0: none 1: left 2: right
var firstTimeIn = false;
var grid = window.screen.width/7;
var flowSpeed = 1;
// function handIn() {
//     handInOut = true;

// }
var actLeftOrRight;// 0: none 1: left 2: right
var twoHandsFlag = false; // whether two hands in
var isScalingFlag = false; // whether scaling image

$(document).on("keydown", function (e) {
    if(e.keyCode == 78) {  //n
        toFullImg();
    }
    if((e.keyCode == 86)) {  //v
        toScaleImg(1.5);
    }
     if((e.keyCode == 90)) {  //z
         toSmallImg();
     }
    if((e.keyCode == 88)) {  //x
        handOut();
    }
        if((e.keyCode == 49)) {  //1
        flowSpeed = 1; 
    }
        if((e.keyCode == 50)) {  //2
        //flowSpeed = 2; 
        toFullImg();
        moveToNext();
    }
        if((e.keyCode == 51)) {  //3
        flowSpeed = 3; 
    }
        if((e.keyCode == 52)) {  //4
        flowSpeed = 4; 
    }
    if((e.keyCode == 53)) {  //5
        flowSpeed = 5; 
    }
     if((e.keyCode == 54)) {  //6
         //$("#cboxNext").click();
         $.colorbox.next();
         console.warn("test");
    }
     if((e.keyCode == 55)) {  //7
        $.colorbox.prev();
    }

});
$(document).ready(function(){
   // $(".content").colorbox({rel:'content'});
    myImgFlow = new ContentFlow('theflow', {endOpacity:0.5, visibleItems:4, relativeItemPosition:'center top', maxItemHeight:0.5*h, flowSpeedFactor:0.5} );
});
function moveToPre() {
    var object = myImgFlow.getActiveItem();
    var pre = object['pre'];
    myImgFlow.moveTo(pre['index']);
}
function moveToNext(){
    var object = myImgFlow.getActiveItem();
    var nxt = object['next'];
    myImgFlow.moveTo(nxt['index']); 
}
function moveToIndex(deltaIndex) {
    var object = myImgFlow.getActiveItem();
   // var nxt = object['next'];
    myImgFlow.moveTo((object['index'] + deltaIndex)%7);
    if(deltaIndex == -3){
        //coords4 += "  hahahahahaahah"
        //document.getElementById("demo4").innerHTML = "<font color=\"red\">" + coords4+"</font>";

    } 
}

document.addEventListener( 'keydown', function( event ){
  console.warn( event.keyCode )
}, false);

/*Use the function below to pop up the window with enlarged image*/
var imgWidthOriginal,imgHeightOriginal;
function toFullImg() {
    
    /*if(imgToFullScreen) {
        $.colorbox.close();
        imgToFullScreen = false;
        return;
    }*/ 
    
    toFullImgFlag = true;
    var object = myImgFlow.getActiveItem();
    var objIndex = object['index'];//.attr("src");
    var objSrc = $("#img" + objIndex).attr("src");
    $.colorbox({href:"" + objSrc, maxHeight:"95%", maxWidth: "95%"});//"+currentNum+".jpg"  
    //$(".item").colorbox({rel:'item'});//"+currentNum+".jpg"             
    imgToFullScreen = true;
    
    var event = document.createEvent( 'KeyboardEvent' );
    event.initKeyboardEvent( 'keydown', true, false, null, 0, false, 0, false, 86, 0 );
    document.dispatchEvent( event );

    var e = $.Event('keydown');
    e.which = 90;
    $(document).trigger(e);  
    //imgWidthOriginal = $(".cboxPhoto").width();
    //imgHeightOriginal = $(".cboxPhoto").height();
    //console.warn("imgWidthOriginal: " + imgWidthOriginal + "  imgHeightOriginal: " + imgHeightOriginal);
}

/*Use the function below to close the window with enlarged image*/
function toSmallImg(){
    $.colorbox.close();
    isScalingFlag = false;
    imgToFullScreen = false;
    isScalingFisrtFlag = true;
}

/*Use the function below to scale up or scale down the image*/
function toScaleImg(imgScale) {
    isScalingFlag = true;
    console.warn("toBeLarger");
 //   var bW =  $("#colorbox").width()*imgScale;
 //   var bH =  $("#colorbox").height()*imgScale;
    if(twoHandsFlag == false){
        imgWidthOriginal = $(".cboxPhoto").width();
        imgHeightOriginal = $(".cboxPhoto").height();
        twoHandsFlag = true;
    }
    var iW = imgWidthOriginal*imgScale;//imgWidthOriginal
    var iH = imgHeightOriginal*imgScale;//imgHeightOriginal
    $(".cboxPhoto").width(iW);
    $(".cboxPhoto").height(iH);
    //console.warn(bW+", "+bH+", "+iW+", "+iH);
}

/*function toThumbnail() {
    $.colorbox.close();
    imgToFullScreen = false;
}*/
//var instance = new ContentFlow();
var preScrollX,preScrollY;
var posX = 0, posY = 0;
var xBoundry, yBoundry;
var scrPos;

$(document).mousemove(function(event){handControl(event);}); 

//control function; event means mouse, no-event means Leap;
function handControl(e, leapX, leapY){
    if(e != null){
        console.warn("abc" + e.pageX); 
    }
    else{
        console.warn("abc" + leapX); 
    }
    if(imgToFullScreen){
        //coords4 += imgToFullScreen ? "  image FULL SCREEN!" : "  NO full SCREEN";
        //document.getElementById("demo4").innerHTML = "<font color=\"red\">" + coords4+"</font>";
        
        xBoundry = $(".cboxPhoto").width() - $("#cboxLoadedContent").width() + 30;
        yBoundry = $(".cboxPhoto").height() - $("#cboxLoadedContent").height() + 60;
        posX = e != null ? posX + e.pageX-preScrollX : posX + leapX - preScrollX;
        console.warn("posx: "+  yBoundry );
        if(posX >= xBoundry) {posX = xBoundry;}
        if(posX < 0) {posX = -10;}
        posY = e != null ? posY + e.pageY-preScrollY : posY + leapY - preScrollY;
        if(posY >= yBoundry) {posY = yBoundry;}
        if(posY < 0) {posY = -10;}
        //console.warn("posY: "+  posY);
        $("#cboxLoadedContent").scrollTop(posY);//scrollBy(e.pageX-preScrollX,);
        $("#cboxLoadedContent").scrollLeft(posX);
        if(e != null){
            console.warn(preScrollX+", "+preScrollY + ", " + e.pageX + ", " + e.pageY);
        }
        else{
            console.warn(preScrollX+", "+preScrollY + ", " + leapX + ", " + leapY);
        }
        
        //navigation
        if((e!=null ? e.pageX : leapX) > window.innerWidth-50 && fullMoveFlag == false && isScalingFlag == false){//right
            fullMoveFlag = true;
            setTimeout(function(){
                moveToIndex(1);
            }, 100); 
            setTimeout(function(){                
                toFullImg();
            }, 200);
        }
        if((e!=null ? e.pageX : leapX) < 50 && fullMoveFlag == false && isScalingFlag == false){//left
            fullMoveFlag = true;
            setTimeout(function(){
                moveToIndex(-1);
            }, 100); 
            setTimeout(function(){                
                toFullImg();
            }, 200);
        }
        if((e!=null ? e.pageX : leapX) > 50 && (e!=null ? e.pageX : leapX) < window.innerWidth-50 && fullMoveFlag == true && twoHandsFlag == false){
            fullMoveFlag = false;//could navigate again
        }
    }

    preScrollX = e!=null ? e.pageX : leapX;
    preScrollY = e!=null ? e.pageY : leapY;

    if(!imgToFullScreen) {
            if(firstTimeIn) {
                //leftOrRight = true; // right
                scrPos = (e!=null ? e.pageX : leapX);///10.588;
                firstTimeIn = false;
                return;

            }

            if(leftOrRight == 0) {
                if((e!=null ? e.pageX : leapX) >= (scrPos + grid)) {
                    leftOrRight = 2; // right
                        console.warn("qqq" + (e!=null ? e.pageX : leapX));

                                            //console.warn("aaa");
                    // var test = Math.floor((e.pageX - scrPos)/grid);
                    // console.warn(test);
                    // moveToIndex(test);
                   // console.warn(Math.floor((e.pageX - scrPos)/grid));

                    // for(var i = 0; i <=test; i ++ ) {
                        //if(3 > 2) { moveToIndex(3)}
                    //moveToNext();
                    moveToIndex(flowSpeed);
                    //     console.warn("sss");
                    // }

                    scrPos = (e!=null ? e.pageX : leapX);
                    return;
                }
                if((e!=null ? e.pageX : leapX) <= (scrPos - grid)) {
                    leftOrRight = 1; // left
                    scrPos = (e!=null ? e.pageX : leapX);
                    moveToIndex(-flowSpeed);
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
                    // moveToPre();
                    moveToIndex(-flowSpeed);

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
                    //moveToNext();
                    moveToIndex(flowSpeed);

                    return;
                }
                return;
            }

    }    
}
