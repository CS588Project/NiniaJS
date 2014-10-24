var begin = 0;
var offset = 2;
var expand = false;
var w = window.innerWidth;
var color = ['White', 'DarkGray', 'BlueViolet', 'Blue', 'Green', 'Yellow', 'DarkOrange', 'Red', 'SaddleBrown', 'Cyan'];

function initialization(){
  hideColorWheel();
}

function expandColorWheel(){
  var c = document.getElementById("colorwheel");
  var ctx = c.getContext("2d");
  var cX = event.clientX;  
  var cY = event.clientY;

  if(cX > (w-100) && cY <100){
    ctx.clearRect(0,0,600,600);
    c.style.left = (w-600).toString()+'px';
    for (var i = 0; i < 10; i++) {
      ctx.beginPath();
      var start = offset+i/10*2*Math.PI;
      var end = offset+(i+1)/10*2*Math.PI;
      ctx.arc(600,0,250,start,end);
      ctx.strokeStyle = color[(begin+i)%10];
      ctx.lineWidth = 120;
      ctx.stroke();
      ctx.closePath();
    }
    expand = true;
  }

  if(expand){
    begin = Math.ceil(cY/60);
    ctx.clearRect(0,0,600,600);
    c.style.left = (w-600).toString()+'px';
    for (var i = 0; i < 10; i++) {
      ctx.beginPath();
      var start = offset+i/10*2*Math.PI;
      var end = offset+(i+1)/10*2*Math.PI;
      ctx.arc(600,0,250,start,end);
      ctx.strokeStyle = color[(begin+i)%10];
      ctx.lineWidth = 120;
      ctx.stroke();
      ctx.closePath();
    }
    document.getElementById("color").innerHTML = "<font color="+color[(begin+i)%10]+">" + (begin%10)+"</font>";
  }  
}

function hideColorWheel(){
  var c = document.getElementById("colorwheel");
  var ctx = c.getContext("2d");

  ctx.clearRect(0,0,600,600);
  c.style.left = (w-600).toString()+'px';
  for (var i = 0; i < 10; i++) {
    ctx.beginPath();
    var start = offset+i/10*2*Math.PI;
    var end = offset+(i+1)/10*2*Math.PI;
    ctx.arc(600,0,100,start,end);
    ctx.strokeStyle = color[(begin+i)%10];
    ctx.lineWidth = 100;
    ctx.stroke();
    ctx.closePath();
  }
  expand = false;
}