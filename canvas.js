var pen_begin = 0;
var color_begin = 0;
var pen_offset = 3.6;
var color_offset = 2;
var pen_wheel_expand = false;
var color_wheel_expand = false;
var w = window.innerWidth;
var h = window.innerHeight;
var color = ['White', 'DarkGray', 'BlueViolet', 'Blue', 'Green', 'Yellow', 'DarkOrange', 'Red', 'SaddleBrown', 'Cyan'];
var pensize = [1, 2, 4, 8, 12, 16, 20, 18, 14, 10, 6];
var drawing = 0; //['off', 'draw', 'erase']
var draw_off = 0, draw_on = 1, draw_erase=2;

function initialization(){ 
  w = window.innerWidth;
  h = window.innerHeight;
  document.getElementById("maincanvas").width =  w;
  document.getElementById("maincanvas").height =  h;
  document.getElementById("cursor").width =  w;
  document.getElementById("cursor").height =  h;
  document.getElementById("colorwheel").style.left = (w-600).toString()+'px';
  document.getElementById("penwheel").style.top = (h-600).toString()+'px';
  document.getElementById("penwheel").style.left = (w-600).toString()+'px';
  document.getElementById("seletedpensize").style.top = (h-50).toString()+'px';
  hidePenWheel();
  hideColorWheel();
}

function switchdraw(){
  var main_ctx = document.getElementById("maincanvas").getContext("2d");
  var curs_ctx = document.getElementById("cursor").getContext("2d");

  if(color_wheel_expand){
    hideColorWheel();
  } else if(pen_wheel_expand) {
    hidePenWheel();
  } else {
    if(drawing == draw_off){
      drawing = draw_on;
      main_ctx.beginPath();
    } else {
      drawing = draw_off;
      main_ctx.closePath();
    }
  }
}

function eraser(){
  var main_ctx = document.getElementById("maincanvas").getContext("2d");

  drawing = draw_erase;
  main_ctx.beginPath();
}

function draw(event){
  var cX = event.clientX;  
  var cY = event.clientY;
  var curs_ctx = document.getElementById("cursor").getContext("2d");
  var mc = document.getElementById("maincanvas");
  var main_ctx = mc.getContext("2d");
  var esize = pensize[pen_begin%10]*8+40;
  
  //paint control
  if (drawing == draw_on) {
    document.getElementById("msg").innerHTML = "<font color='red'> cursor position: " + cX +","+ cY +" </font>";
    main_ctx.lineTo(cX, cY);
    main_ctx.lineCap = 'round';
    main_ctx.lineWidth = pensize[pen_begin%10];
    main_ctx.strokeStyle = color[color_begin%10];
    main_ctx.stroke();
  } else if(drawing == draw_erase) {
    main_ctx.clearRect(cX-esize/2, cY-esize/2, esize, esize);
  } else {
    main_ctx.moveTo(cX, cY);
    if(color_wheel_expand && !pen_wheel_expand){
      color_begin = Math.ceil(cY/30);
      colorWheel(250, 120);
      document.getElementById("seletedcolor").innerHTML = "<font color="+color[color_begin%10]+">" + (color_begin%10)+"</font>";
    } else {
      if(!pen_wheel_expand) expandColorWheel(event);
    }

    if(pen_wheel_expand){
      pen_begin = Math.ceil(cY/30);
      penWheel(250);
      document.getElementById("seletedpensize").innerHTML = "<font color='white'>" + pensize[pen_begin%10]+"</font>";
    } else {
      if(!color_wheel_expand) expandPenWheel(event);
    }
  }

  //cursor    
  curs_ctx.beginPath();
  curs_ctx.clearRect(0,0,w,h);
  curs_ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';

  if(drawing == draw_erase){
    curs_ctx.rect(cX-esize/2, cY-esize/2, esize, esize);
  } else if(drawing == draw_on) {
    curs_ctx.arc(cX, cY, 3+pensize[pen_begin%10], 0, 2*Math.PI);
    curs_ctx.fillStyle = color[color_begin%10];
  } else {
    if(pen_wheel_expand || color_wheel_expand){
      var arrow = new Image();
      arrow.src = "./img/darrow.png";
      curs_ctx.drawImage(arrow,w-80, cY-100, 30, 200);
    } else {
      cursor(event);
    }
  }
  
  curs_ctx.shadowBlur = 20;
  curs_ctx.moveTo(cX, cY);
  curs_ctx.fill();
  curs_ctx.closePath();
}

function expandColorWheel(event){
  var cX = event.screenX;  
  var cY = event.screenY;

  if(cX > (w-100) && cY < 200){
    color_wheel_expand = true;
    colorWheel(250, 120);
  }
}

function hideColorWheel(){  
  color_wheel_expand = false;
  colorWheel(100, 100);
}

function colorWheel(r, size){
  var ctx = document.getElementById("colorwheel").getContext("2d");

  ctx.clearRect(0,0,600,600);

  ctx.shadowColor = '#999';
  ctx.shadowBlur = 50;

  for (var i = 0; i < 10; i++) {
    var start = color_offset+i/10*2*Math.PI;
    var end = color_offset+(i+1)/10*2*Math.PI;
    ctx.beginPath();
    ctx.arc(600,0,r,start,end);
    ctx.strokeStyle = color[(color_begin+i)%10];
    ctx.lineWidth = size;
    ctx.stroke();
    ctx.closePath();
  }
  
}

function expandPenWheel(event){
  var cX = event.screenX;  
  var cY = event.screenY;

  if(cX > (w-100) && cY > (h+25)){
    pen_wheel_expand = true;
    penWheel(250);
  }
}

function hidePenWheel(){
  pen_wheel_expand = false;
  penWheel(100);
}

function penWheel(r){
  var ctx = document.getElementById("penwheel").getContext("2d");

  ctx.clearRect(0,0,600,600);
  ctx.shadowColor = '#999';
  ctx.shadowBlur = 50;

  for (var i = 0; i < 10; i++) {
    var start = pen_offset+i/10*2*Math.PI;
    var end = pen_offset+(i+1)/10*2*Math.PI;
    ctx.beginPath();
    ctx.arc(600,600,r,start,end);
    ctx.strokeStyle = 'white';
    ctx.lineCap = 'round';
    ctx.lineWidth = 1;
    ctx.lineWidth = pensize[(pen_begin+i)%10];
    ctx.stroke();
    ctx.closePath();
  }
}

