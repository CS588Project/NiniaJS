// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player) after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  var id = getParameterByName("id");
  player = new YT.Player('player', {
    height: window.innerHeight - 12,
    width: window.innerWidth - 12,
    videoId: id,
    events: {
      'onReady': onPlayerReady
    }
  });
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}
var leftOrRight = 0; // 0: none 1: left 2: right
var firstTimeIn = true;
var scrPos;
var video_pause = false;
function youtubeControl(frame){
  if(frame.hands.length == 1 && frame.pointables.length > 0){    
    //Get a pointable and normalize the tip position
    var pointable = frame.pointables[2];
    var interactionBox = frame.interactionBox;
    var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);

    canvasWholeX = window.innerWidth * normalizedPosition[0];
    canvasWholeY = window.innerHeight * (1 - normalizedPosition[1]);

    timeshift(null, canvasWholeX, canvasWholeY);
    //pause
    if(canvasWholeY > window.innerHeight - 50 && imgToFullScreen == true && isScalingFlag == false){
      if(!video_pause) pauseVideo();
      else playVideo();
    }
  }
}

//control function; event means mouse, no-event means Leap;
function timeshift(e, leapX, leapY){
    if(firstTimeIn) {
        scrPos = (e!=null ? e.pageX : leapX);
        firstTimeIn = false;
        return;
    }
    if((e!=null ? e.pageX : leapX) >= (scrPos + 10)) {
        jumpByTime(2);
        scrPos = (e!=null ? e.pageX : leapX);
        return;
    }
    if((e!=null ? e.pageX : leapX) <= (scrPos - 10)) {
        scrPos = (e!=null ? e.pageX : leapX);
        jumpByTime(-2);
        return;
    }
    return;
}

function playVideo(){
  video_pause = false;
  player.playVideo();
}
function pauseVideo() {
  video_pause = true;
  player.pauseVideo();
}

function seekTo(time){
  player.seekTo(time, true);
}

function jumpByTime(seconds){
 
  var time = player.getCurrentTime() + seconds;
  if(time >= 0 && time < player.getDuration()){
    seekTo(time);
  }
}

function mute(){
  player.mute();
}

function unmute(){
  player.unMute();
}

function increaseVolume(){
  if(player.getVolume() <= 95){
    player.setVolume(player.getVolume() + 5);
  }
}

function decreaseVolume(){
  if(player.getVolume() >= 5){
    player.setVolume(player.getVolume() - 5);
  } 
}

function closePopUp(){
  parent.jQuery.colorbox.close();
}

$(document).ready(function(){
  var controllerOptions = {enableGestures: true, background: true};
  Leap.loop(controllerOptions,{
    frame:function(frame) {
      youtubeControl(frame);
    }
  });

  $(document).keydown(function(e){
      if(e.which == 88){
        mute();
      }else if(e.which == 90){
        closePopUp();
      }else if(e.which == 67){
        unmute();
      }else if(e.which == 86){
        increaseVolume();
      }else if(e.which == 66){
        decreaseVolume();
      }else if(e.which == 78){
        pauseVideo();
      }else if(e.which == 77){
        playVideo();
      }else if(e.which == 65){
        jumpByTime(5);
      }else if(e.which == 83){
        jumpByTime(-5);
      }else if(e.which == 70){
        var el = document.getElementById('#my-player-element-container');
        if (el.requestFullScreen) {
          el.requestFullScreen();
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen();
        } else if (el.webkitRequestFullScreen) {
          el.webkitRequestFullScreen();
        }
      }
  });
});