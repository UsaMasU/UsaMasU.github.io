'use strict';

function counterControl(event) {
  let count;
  switch(event.target.id) {
    case 'increment':
      count = +localStorage.getItem('counter'); 
      localStorage.setItem('counter', count += 1);
      break;
    case 'decrement':
      count = +localStorage.getItem('counter');
      localStorage.setItem('counter', count -= 1);
      break;
    case 'reset':
      localStorage.removeItem('counter');
      counter.textContent = localStorage.setItem('counter', 0);
      break;
    default:
  }
  counter.textContent = localStorage.getItem('counter');
}

const counter = document.querySelector('.wrap #counter');
localStorage.getItem('counter') == null ? counter.textContent = localStorage.setItem('counter', 0) : counter.textContent = localStorage.getItem('counter');

const counterButtons = document.querySelectorAll('.wrap .wrap-btns button')
Array.from(counterButtons).forEach(btn => { 
  btn.addEventListener('click', counterControl); 
});