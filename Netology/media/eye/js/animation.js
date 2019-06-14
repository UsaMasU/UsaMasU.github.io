'use strict';

const eye = document.querySelector('.big-book__eye');
const pupil = document.querySelector('.big-book__pupil');

window.addEventListener('mousemove', animatePupil);

function animatePupil(event) {
  const eyeCoords = eye.getBoundingClientRect();

  const startX = eyeCoords.left + eyeCoords.width / 2;
  const startY = eyeCoords.top + eyeCoords.height / 2;
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const leftDistance = startX;
  const rightDistance = document.documentElement.clientWidth - startX;
  const topDistance = startY;
  const bottomDistance = document.documentElement.clientHeight - startY;

  const traveledDistanceX = mouseX - startX;
  const traveledDistanceY = mouseY - startY;

  const pupilX = mouseX < startX ? 30 * traveledDistanceX / leftDistance : 30 * traveledDistanceX / rightDistance;
  const pupilY = mouseY < startY ? 30 * traveledDistanceY / topDistance : 30 * traveledDistanceY / bottomDistance;
  pupil.style.setProperty('--pupil-x', `${pupilX}px`);
  pupil.style.setProperty('--pupil-y', `${pupilY}px`);

  const progress = Math.max(Math.abs(pupilX), Math.abs(pupilY)) / 30;
  const pupilSize = 3 - (3 - 1) * progress;
  pupil.style.setProperty('--pupil-size', pupilSize);
}
