var w = window.innerWidth;
var h = window.innerHeight;
//var current =1;
var imgToFullScreen = false;
//var imgNo;
var state = 10;
//var currentItemNum;
//var firstTime = true;
//var firstTimeNum = 2;
$(document).keydown(function (e) {
    if(e.keyCode == 78) {  //
        toFullImg();
    }
    if((e.keyCode == 77)) {  //
        toThumbnail();
    }
    if((e.keyCode == 86)) {  //
        toScaleImg(1.5);
    }
});
$(document).ready(function(){
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
function toFullImg() {
    if(imgToFullScreen)return; 
    var object = myImgFlow.getActiveItem();
    var objIndex = object['index'];//.attr("src");
    var objSrc = $("#img" + objIndex).attr("src");
    $.colorbox({href:"" + objSrc, maxHeight:"95%", maxWidth: "95%"});//"+currentNum+".jpg"             
    imgToFullScreen = true;
}

function toScaleImg(imgScale) {
    console.warn("toBeLarger");
    var bW =  $("#colorbox").width()*imgScale;
    var bH =  $("#colorbox").height()*imgScale;
    var iW = $(".cboxPhoto").width()*imgScale;
    var iH = $(".cboxPhoto").height()*imgScale;
    $(".cboxPhoto").width(iW);
    $(".cboxPhoto").height(iH);
    console.warn(bW+", "+bH+", "+iW+", "+iH);
}

function toThumbnail() {
    $.colorbox.close();
    imgToFullScreen = false;
}
//var instance = new ContentFlow();
var preScrollX,preScrollY;
var posX = 0, posY = 0;
var xBoundry, yBoundry;
$(document).mousemove(function(e){
    if(imgToFullScreen){
        xBoundry = $(".cboxPhoto").width() - $("#cboxLoadedContent").width() + 30;
        yBoundry = $(".cboxPhoto").height() - $("#cboxLoadedContent").height() + 60;
        posX = posX + e.pageX-preScrollX;
        console.warn("posx: "+  yBoundry );
        if(posX >= xBoundry) {posX = xBoundry;}
        if(posX < 0) {posX = -10;}
        posY = posY + e.pageY-preScrollY;
        if(posY >= yBoundry) {posY = yBoundry;}
        if(posY < 0) {posY = -10;}
        //console.warn("posY: "+  posY);
        $("#cboxLoadedContent").scrollTop(posY);//scrollBy(e.pageX-preScrollX,);
        $("#cboxLoadedContent").scrollLeft(posX);
        console.warn(preScrollX+", "+preScrollY + ", " + e.pageX + ", " + e.pageY);
    }
    preScrollX = e.pageX;
    preScrollY = e.pageY;
    if(!imgToFullScreen) {
        var scrPos = e.pageX;///10.588;
            var grid = window.screen.width/20;
            var ev;
                if (scrPos < grid && scrPos > 0) {
                    if(state > 0) {
                        state = 0;
                        moveToPre();
                    }
                    
                } 
                else if (scrPos < 2*grid && scrPos >= grid) {
                    if(state > 1) {
                        state = 1;
                        moveToPre();  
                    }
                    if(state = 0) {
                        state = 1;
                    }
                }
                else if (scrPos < 3*grid && scrPos >= 2*grid) {
                    if(state > 2) {
                        state = 2;
                        moveToPre();
                    }
                    if(state < 2) {
                        state = 2;
                    }
                } 
                else if (scrPos < 4*grid && scrPos >= 3*grid) {
                    if(state > 3) {
                        state = 3;
                        moveToPre();
                    }
                    if(state < 3) {
                        state = 3;
                    }
                } 
                else if (scrPos < 5*grid && scrPos >= 4*grid) {
                    if(state > 4) {
                        state = 4;
                        moveToPre();
                    }
                    if(state < 4) {
                        state = 4;
                    }
                } 
                else if (scrPos < 6*grid && scrPos >= 5*grid) {
                    if(state > 5) {
                        state = 5;
                        moveToPre();
                    }
                    if(state < 5) {
                        state = 5;
                    }
                } 
                else if (scrPos < 7*grid && scrPos >= 6*grid) {
                    if(state > 6) {
                        state = 6;
                        moveToPre();
                    }
                    if(state < 6) {
                        state = 6;
                    }
                } 
                else if (scrPos < 8*grid && scrPos >= 7*grid) {
                    if(state > 7) {
                        state = 7;
                        moveToPre();
                    }
                    if(state < 7) {
                        state = 7;
                    }
                } 
//**************************************************************
                else if (scrPos < 12*grid && scrPos >= 8*grid) {
                    state = 10;
                } 
 //**************************************************************        
                else if (scrPos < 13*grid && scrPos >= 12*grid) {
                    //console.warn("grid3-4");
                    if(state < 12) {
                        //console.warn("grid3-4");
                       // console.warn("state: " + state);
                        //if (current < $('#coverflow > *').length - 1) {
                            state = 12;
                            moveToNext();
                       // }
                    }
                    if(state > 12) {
                        state = 12;
                    }
                }      
                else if (scrPos < 14*grid && scrPos >= 13*grid) {
                    //console.warn("grid3-4");
                    if(state < 13) {
                       // console.warn("grid3-4");
                      //  console.warn("state: " + state);
                       // if (current < $('#coverflow > *').length - 1) {
                            state = 13;
                            moveToNext();
                       // }
                    }
                    if(state > 13) {
                        state = 13;
                    }
                } 
                else if (scrPos < 15*grid && scrPos >= 14*grid) {
                    //console.warn("grid3-4");
                    if(state < 14) {
                      //  console.warn("grid3-4");
                       // console.warn("state: " + state);
                       // if (current < $('#coverflow > *').length - 1) {
                            state = 14;
                            moveToNext();
                       // }
                    }
                    if(state > 14) {
                        state = 14;
                    }
                } 
                else if (scrPos < 16*grid && scrPos >= 15*grid) {
                    //console.warn("grid3-4");
                    if(state < 15) {
                       // console.warn("grid3-4");
                      //  console.warn("state: " + state);
                       // if (current < $('#coverflow > *').length - 1) {
                            state = 15;
                            moveToNext();
                       // }
                    }
                    if(state > 15) {
                        state = 15;
                    }
                } 
                else if (scrPos < 17*grid && scrPos >= 16*grid) {
                    //console.warn("grid3-4");
                    if(state < 16) {
                       // console.warn("grid3-4");
                       // console.warn("state: " + state);
                       // if (current < $('#coverflow > *').length - 1) {
                            state = 16;
                            moveToNext();
                        //}
                    }
                    if(state > 16) {
                        state = 16;
                    }
                } 
                else if (scrPos < 18*grid && scrPos >= 17*grid) {
                    //console.warn("grid3-4");
                    if(state < 17) {
                       // console.warn("grid3-4");
                       // console.warn("state: " + state);
                       // if (current < $('#coverflow > *').length - 1) {
                            state = 17;
                           moveToNext();
                       // }
                    }
                    if(state > 17) {
                        state = 17;
                    }
                } 
                else if (scrPos < 19*grid && scrPos >= 18*grid) {
                    //console.warn("grid3-4");
                    if(state < 18) {
                       // console.warn("grid3-4");
                       // console.warn("state: " + state);
                       // if (current < $('#coverflow > *').length - 1) {
                            state = 18;
                            moveToNext();
                       // }
                    }
                    if(state > 18) {
                        state = 18;
                    }
                } 
                else if (scrPos < 20*grid && scrPos >= 19*grid) {
                    //console.warn("grid3-4");
                    if(state < 19) {
                       // console.warn("grid3-4");
                       // console.warn("state: " + state);
                       // if (current < $('#coverflow > *').length - 1) {
                            state = 19;
                            moveToNext();
                       // }
                    }
                    if(state > 19) {
                        state = 19;
                    }
                }   
                else {}
    }    
        }); 
