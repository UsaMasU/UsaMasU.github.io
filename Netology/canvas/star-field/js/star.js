'use strict';

const canvas = document.querySelector('canvas'); 
const canvasWidth = +getComputedStyle(canvas).width.slice(0, -2);
const canvasHeight = +getComputedStyle(canvas).height.slice(0, -2);
const ctx = canvas.getContext('2d');

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColor(starColors) {
  return starColors[Math.floor(Math.random() * starColors.length)];   
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function starSky() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  let stars = randomInt(200, 400);
  for(let star = 1; star < stars; star ++) {
    let posX =  randomInt(0, canvasWidth);
    let posY =  randomInt(0, canvasHeight);
    let diameter = randomFloat(0, 1.1);
    let color = randomColor(['#ffffff', '#ffe9c4', '#d4fbff']);
    let bright = randomFloat(0.8, 1);
    ctx.beginPath();
      ctx.globalAlpha = bright;
      ctx.fillStyle = color;
      ctx.arc(posX, posY, diameter, 0, (Math.PI/180) * 360);
      ctx.fill();
    ctx.closePath();
  }
}

canvas.addEventListener('click', event => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  starSky();
});

window.onload = starSky();
