'use strict';

const catEyes = document.querySelectorAll('.cat_eye');

document.addEventListener('mousemove', event => {
	 let eyeOrbit = null;
  
	 for(let eye of catEyes) {
		  if(eye.classList.contains('cat_eye_left')) eyeOrbit = document.querySelector('.cat_position_for_left_eye');	
    else eyeOrbit = document.querySelector('.cat_position_for_right_eye');
    
		  let eyeOrbitBounds = eyeOrbit.getBoundingClientRect();

		  if(event.pageX > eyeOrbitBounds.right) eye.style.left = 50 + '%';
    else if(event.pageX < eyeOrbitBounds.left) eye.style.left = 0 + 'px';
    else eye.style.left = 25 + '%';

		  if(event.pageY < eyeOrbitBounds.top) eye.style.top = 0 + 'px';
    else if(event.pageY > eyeOrbitBounds.bottom) eye.style.top = 50 + '%';
    else eye.style.top = 25 + '%';
	 }
});