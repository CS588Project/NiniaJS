var w = window.innerWidth;
var h = window.innerHeight;
PDFJS.workerSrc = "js/pdfjs/build/pdf.worker.js";

function getActiveItem() {
    //var myNewFlow = new ContentFlow('cf', {endOpacity:0.5, visibleItems:4, relativeItemPosition:'center top', maxItemHeight:h*0.8, flowSpeedFactor:0.5}) ;
    var x = document.getElementById("demo");
    
    var output = '';
    var object = myNewFlow.getActiveItem()
    x.innerHTML = "<font color='red'>"+object['index']+"</font>";
    alert(output);
}

function moveToPre(){
    var object = myNewFlow.getActiveItem();
    var pre = object['pre'];
    myNewFlow.moveTo(pre['index']);
}

function moveToNxt(){
    var object = myNewFlow.getActiveItem();
    var nxt = object['next'];
    myNewFlow.moveTo(nxt['index']);
}

function getFileName(){
    var object = myNewFlow.getActiveItem();
    var idx = Number(object['index']);
    var x = document.getElementById("demo");
    x.innerHTML = "<font color='red'>"+pdflist[idx]+"</font>";
}

function getPDFThumbnail(idx, pdf_name) {
    PDFJS.getDocument("PDF/"+pdf_name).then( function(pdf){
        pdf.getPage(1).then( function(page) {
            var viewport = page.getViewport(1);
            var canvas = document.getElementById('pdf_thumbnail'+idx);
            var ctx = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            page.render(renderContext).then( function(){
                //set to draw behind current content
                ctx.globalCompositeOperation = "destination-over";

                //set background color
                ctx.fillStyle = "#ffffff";

                //draw background / rect on entire canvas
                ctx.fillRect(0,0,canvas.width,canvas.height);
                //var img = canvas.toDataURL();
                //var x = document.getElementById("demo");
                //x.innerHTML = '<font color="red">'+img+'</font>'
                //localStorage.setItem('pdf_thumbnail'+idx, img);
            });
        });
    });
}

$(document).ready( function() {
    myNewFlow = new ContentFlow('cf', {endOpacity:0.5, visibleItems:4, relativeItemPosition:'center top', maxItemHeight:h*0.8, flowSpeedFactor:0.5});
    //var myNewFlow = new ContentFlow('cf', {endOpacity:0.5, visibleItems:4, relativeItemPosition:'center top', maxItemHeight:h*0.8, flowSpeedFactor:0.5}) ;
    //can use flowSpeedFactor to change the speed
    pdflist = ["01.pdf", "02.pdf", "03.pdf", "04.pdf", "05.pdf", "06.pdf", "07.pdf", "08.pdf", "09.pdf"];

    for (var i = 0; i < pdflist.length; i++) {
        getPDFThumbnail(i, pdflist[i]);
    };
    var x = document.getElementById("demo");
    x.innerHTML = "<font color='red'>"+myNewFlow.getActiveItem()+"</font>";
    //TODO: Dynamicaly add Image
    /**
    var x = document.getElementById("demo");
    var s = "";
    for (var i = 0; i < pdflist.length; i++) {
        s = addImage(s,localStorage.getItem('pdf_thumbnail'+i));
    };
    localStorage.setItem('thumbnail_code', s);
    document.getElementById("theflow").innerHTML = s;

    function addImage (s, idx) {
    s = s + "<div class='item'><canvas id=pdf_thumbnail"+idx+" class='content'/></div>";
    return s;
    }
    **/
    
});