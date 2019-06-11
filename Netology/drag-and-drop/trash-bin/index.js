'use strict';

const trashBin = document.querySelector('#trash_bin');

let itemIcon = null;
let itemShiftX = null;
let itemShiftY = null;

document.addEventListener('mousedown', event => {
	 if(event.which != 1) return;
	
	 if(event.target.classList.contains('logo')) {
		  itemIcon = event.target;
		  const itemBounds = event.target.getBoundingClientRect();
		  itemShiftX  = itemBounds.width / 2 - window.pageXOffset;
		  itemShiftY = itemBounds.height / 2 - window.pageYOffset;
	 }
})

document.addEventListener('mousemove', event => {
	 if(itemIcon) {
		  event.preventDefault();
		  itemIcon.style.left = event.pageX - itemShiftX + 'px';
		  itemIcon.style.top = event.pageY - itemShiftY + 'px';
		  itemIcon.classList.add('moving');
	 }
})

document.addEventListener('mouseup', event => {
	 if(itemIcon) {
		  const check = document.elementFromPoint(event.clientX, event.clientY)
		  if(check) {
			   check.appendChild(itemIcon);
			   itemIcon.classList.remove('moving');			
			   itemIcon = null;
		  }
	 }
})