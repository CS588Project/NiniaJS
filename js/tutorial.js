$(document).ready( function(){
  tutorial_idx = 0;
  first_check = ['gallery_first','slides_first','video_first','canvas_first'];
  var fcheck = first_check[0];
  if (document.title == "Ninia - Video"){
    fcheck = first_check[2];
    t_set = ['t_video_wave','t_video_flipup','t_video_wave2','t_video_circle', 't_video_stop', 't_video_flipup'];
  }
  else if(document.title == "Ninia - Gallery"){
    fcheck = first_check[0];
    t_set = ['t_gallery_wave','t_gallery_flipup','t_gallery_scale','t_gallery_move', 't_gallery_flipup'];
  }
  else if(document.title == "Ninia - Canvas"){
    fcheck = first_check[3];
    t_set = ['t_canvas_pokein','t_canvas_movefinger','t_canvas_movestop','t_canvas_movetocorner', 't_canvas_movetoside', 't_canvas_movetotop'];
  }
  else if(document.title == "Ninia - Slides"){
    fcheck = first_check[1];
    t_set = ['t_slides_wave','t_slides_flipup', 't_slides_circle', 't_slides_flipup'];
  }

  if(checkCookie(fcheck)){
    document.getElementById('tutorial_img').style.visibility='hidden';
    return 0;
  }
  else setCookie(fcheck, true, 1); 
  document.getElementById('tutorial_img').style.visibility='visible';
  $('.blur').removeClass("disableTutorial").removeClass("enableBlur").addClass("enableTutorial");
  console.log(location.pathname);

  nextTutorial();
});

function nextTutorial() { 
  var t_img = document.getElementById('tutorial_img');
  var t_src = document.createAttribute('src');

  if(tutorial_idx >= t_set.length){
    $("#tutorial_img").animate({ opacity:'0'}, 'slow');
    t_img.style.zIndex='0';
    document.getElementById('tutorial_img').style.visibility='hidden';
    $('.blur').removeClass("enableTutorial");
    return false;
  } else{
    $("#tutorial_img").animate({ opacity:'0'}, 'slow', function(){
      t_src.value = 'img/gesture/'+ t_set[tutorial_idx++] +'.png';
      t_img.setAttributeNode(t_src);
      $("#tutorial_img").animate({ opacity:'1'}, 'slow');
    }); 
  }
  return true;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

function checkCookie(cname) {
    var user = getCookie(cname);
    if (user == "") {
        return false;
    } else {
        return true;
    }
}
