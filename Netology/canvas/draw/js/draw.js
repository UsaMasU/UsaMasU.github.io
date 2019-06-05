'use strict';

let canvas = document.querySelector('#draw');
let ctx = canvas.getContext("2d");
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);

let mouse = { x:0, y:0};
let draw = false;
let hue = 0;
let lineWidth = 0;
let widthDir = 'up'
let shiftPressed;

ctx.lineWidth;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';


canvas.addEventListener("mousedown", function(event) {				
		mouse.x = event.pageX - this.offsetLeft;
		mouse.y = event.pageY - this.offsetTop;
		draw = true;
		ctx.beginPath();
          
		ctx.moveTo(mouse.x, mouse.y);
          
});

canvas.addEventListener("mousemove", function(event) {
		if(draw==true) {	

				mouse.x = event.pageX - this.offsetLeft;
				mouse.y = event.pageY - this.offsetTop;
    
				ctx.lineTo(mouse.x, mouse.y);

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = 'hsl(' + hue +', 100%, 50%)';

			 ctx.stroke();
		}
});

canvas.addEventListener("mouseup", function(event) {				
  mouse.x = event.pageX - this.offsetLeft;
  mouse.y = event.pageY - this.offsetTop;
	 ctx.lineTo(mouse.x, mouse.y);
		ctx.stroke();
		ctx.closePath();
		draw = false;
});


canvas.addEventListener("mousemove", function(event) {
	 shiftPressed = event.shiftKey;	
});

canvas.addEventListener("mouseover", function(event) {
	 draw=false;	
});

canvas.addEventListener("dblclick", function(event) {	
  canvasClear();
});

window.addEventListener('resize', function(event) {
  canvasClear();
});


function canvasClear() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';  
}

function tick () {
  if(shiftPressed) {
    hue -= 1;
    if(hue < 0) hue = 359;
  }
  else {
    hue += 1;
      if(hue > 359 ) hue = 0;
  }
  switch(widthDir) {
    case 'up':
      lineWidth += 1;
      if(lineWidth == 100 ) widthDir = 'down';
      break;
    case 'down':
      lineWidth -= 1;
      if(lineWidth == 0 ) widthDir = 'up';
      break;
    default:
      break;
  }
 
  ctx.beginPath();
  window.requestAnimationFrame(tick);
}

tick();