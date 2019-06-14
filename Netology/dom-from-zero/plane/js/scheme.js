'use strict'

const formInline = document.querySelector('.form-inline');
const planeType = formInline.querySelector('.form-group .form-control');
planeType.addEventListener('change', changePlane);

const btnSeatMap = formInline.querySelector('.form-group #btnSeatMap');
btnSeatMap.addEventListener('click', showSeatMap);

const btnSeatFull = formInline.querySelector('.form-group #btnSetFull');
btnSeatFull.addEventListener('click', setSeatFull);
btnSeatFull.setAttribute('disabled','');

const btnSeatEmpty = formInline.querySelector('.form-group #btnSetEmpty');
btnSeatEmpty.addEventListener('click', setSeatEmpty);
btnSeatEmpty.setAttribute('disabled','');

const mainView = document.querySelector('.main-view');
const seatMapTitle = mainView.querySelector('#seatMapTitle');
const seatMapDiv = mainView.querySelector('#seatMapDiv');
const seatMapDivText = seatMapDiv.querySelector('h3');

const totalBar = document.querySelector('.total-bar');

const totalPax = totalBar.querySelector('#totalPax');
let counterPax = 0;
totalPax.textContent = `${counterPax}`;

const totalAdult = totalBar.querySelector('#totalAdult');
let counterAdult = 0;
totalAdult.textContent = `${counterAdult}`;

const totalHalf = totalBar.querySelector('#totalHalf');
let counterHalf = 0;
totalHalf.textContent = `${counterHalf}`;

let planeSeatLetters4;
let planeSeatLetters6;
let planeSeatScheme;

let altPressed;

function showPlane(plane) {
  planeSeatScheme = plane.scheme;
  planeSeatLetters4 = plane.letters4;
  planeSeatLetters6 = plane.letters6;
  counterPax = 0;
  totalPax.textContent = 0;
  counterAdult = 0; 
  totalAdult.textContent = 0;
  counterHalf = 0;
  totalHalf.textContent = 0;
  seatMapTitle.textContent = `${plane.title} (${plane.passengers} пасажиров)`;
  seatMapDivText.textContent = '';
  if(seatMapDiv.querySelectorAll('.row').length > 0) for(let rowChild of seatMapDiv.querySelectorAll('.row')) seatMapDiv.removeChild(rowChild);
}

function showSeatMap(event) {
  event.preventDefault();
  showSeat(planeSeatScheme, planeSeatLetters4, planeSeatLetters6);
  if(seatMapDiv.querySelectorAll('.seat').length > 0) {
    for(let rowChild of seatMapDiv.querySelectorAll('.col-xs-4')) {
      rowChild.addEventListener('click', seatClick);
    }
  }
  btnSeatFull.removeAttribute('disabled');
  btnSeatEmpty.removeAttribute('disabled');
}

function seatClick(event) {
  if(event.currentTarget.classList.contains('no-seat')) return;
  altPressed = event.altKey;	
    
  if(event.currentTarget.classList.contains('half')) { 
    event.currentTarget.classList.remove('half');
    counterHalf -= 1;
    totalHalf.textContent = `${counterHalf}`;
    totalPax.textContent = `${counterPax = counterAdult + counterHalf}`;
    return;
  }
  if(event.currentTarget.classList.contains('adult')) {
    event.currentTarget.classList.remove('adult');  
    counterAdult -= 1;
    totalAdult.textContent = `${counterAdult}`;
    totalPax.textContent = `${counterPax = counterAdult + counterHalf}`;
    return;
  }
  
  if(altPressed) {
    event.currentTarget.classList.add('half');
    counterHalf += 1;
    totalHalf.textContent = `${counterHalf}`;  
  }
  else { 
    event.currentTarget.classList.add('adult');
    counterAdult += 1;
    totalAdult.textContent = `${counterAdult}`;
  }
  totalPax.textContent = `${counterPax = counterAdult + counterHalf}`;
}

function setSeatFull(event) {
  event.preventDefault();
  counterAdult = 0;
  counterHalf = 0;
  for(let rowChild of seatMapDiv.querySelectorAll('.seat')) {
      rowChild.classList.remove('half');
      rowChild.classList.add('adult');
      counterAdult += 1;
    }
  totalHalf.textContent = `${counterHalf}`; 
  totalAdult.textContent = `${counterAdult}`;
  totalPax.textContent = `${counterPax = counterAdult + counterHalf}`;
}

function setSeatEmpty(event) {
  event.preventDefault();
  counterAdult = 0;
  counterHalf = 0;
  counterPax = 0;
  for(let rowChild of seatMapDiv.querySelectorAll('.seat')) {
      rowChild.classList.remove('half');
      rowChild.classList.remove('adult');
    }
  totalHalf.textContent = `${counterHalf}`; 
  totalAdult.textContent = `${counterAdult}`;
  totalPax.textContent = `${counterPax}`;
}

function el(tagName, attributes, children) {
  const element = document.createElement(tagName);
  if (typeof attributes === 'object') {
    Object.keys(attributes).forEach(i => element.setAttribute(i, attributes[i]));
  }
  if (typeof children === 'string') {
    element.textContent = children;
  } else if (children instanceof Array) {
    children.forEach(child => element.appendChild(child));
  }
  return element;
}

function createSeatRow(item, i, arr) {
  let rowNumber = i + 1;
  let seatConfig = [];
  for(let x = 0; x < 6; x++) seatConfig.push({seat: 'seat', label: ''});

  switch(item) {
    case 6:
      seatConfig.forEach(function(setupItem, setupIndex, setupArr) {
        setupItem.seat = 'seat';
        setupItem.label = planeSeatLetters6[setupIndex];      
      });
      break;
    case 4:
      seatConfig[0].seat = 'no-seat';
      seatConfig[0].label = '';
      seatConfig.filter(function(setupItem, setupIndex, setupArr) {
        if(setupIndex != 0 && setupIndex != seatConfig.length - 1) { 
          setupItem.seat = 'seat';
          setupItem.label = planeSeatLetters4[setupIndex - 1];
        }          
      });
      seatConfig[seatConfig.length -1 ].seat = 'no-seat';
      seatConfig[seatConfig.length -1 ].label = '';      
      break;
    case 0:
      seatConfig.forEach(function(setupItem, setupIndex, setupArr) {
        setupItem.seat = 'no-seat';
        setupItem.label = '';      
      });   
      break;
    default:
  }
  
  return el('div', {class: 'row seating-row text-center'},[
           el('div', {class: 'col-xs-1 row-number'}, [
             el('h2', {class: ''}, rowNumber.toString())
           ]),
           el('div', {class: 'col-xs-5'}, [
             el('div', {class: `col-xs-4 ${seatConfig[0].seat}`}, [
               el('span', {class: 'seat-label'}, `${seatConfig[0].label}`)
             ]), 
             el('div', {class: `col-xs-4 ${seatConfig[1].seat}`}, [
               el('span', {class: 'seat-label'}, `${seatConfig[1].label}`)
             ]),
             el('div', {class: `col-xs-4 ${seatConfig[2].seat}`}, [
               el('span', {class: 'seat-label'}, `${seatConfig[2].label}`)
             ])
           ]),
           el('div', {class: 'col-xs-5'}, [
             el('div', {class: `col-xs-4 ${seatConfig[3].seat}`}, [
               el('span', {class: 'seat-label'}, `${seatConfig[3].label}`)
             ]), 
             el('div', {class: `col-xs-4 ${seatConfig[4].seat}`}, [
               el('span', {class: 'seat-label'}, `${seatConfig[4].label}`)
             ]),
             el('div', {class: `col-xs-4 ${seatConfig[5].seat}`}, [
               el('span', {class: 'seat-label'}, `${seatConfig[5].label}`)
             ])
           ])
         ]);
}

function showSeat(scheme, letters4, letters6) {
  const seats = scheme.map(createSeatRow);
  const fragment = seats.reduce((fragment, currentValue) => {
    fragment.appendChild(currentValue);
    return fragment;
  }, document.createDocumentFragment());
  
  seatMapDiv.appendChild(fragment);
}

function changePlane() {
  fetch(`https://neto-api.herokuapp.com/plane/${this.options[this.selectedIndex].value}`)
    .then(res => res.json())
    .then(showPlane);
}

window.onload = () => changePlane.bind(planeType)();
