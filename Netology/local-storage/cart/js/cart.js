'use strict';

const colorURL = 'https://neto-api.herokuapp.com/cart/colors';
const sizeURL = 'https://neto-api.herokuapp.com/cart/sizes';
const busketURL = 'https://neto-api.herokuapp.com/cart';

function fillSwatch(response, swatchForm, snippet, itemMem, eventFunc) {
  localStorage.getItem(itemMem) == null ? localStorage.setItem(itemMem, '') : localStorage.getItem(itemMem);
  for(let item in response) swatchForm.innerHTML += snippet(response[item], localStorage.getItem(itemMem));
  eventFunc.addEventListener('click', (event) => {if(event.target.tagName == 'INPUT') localStorage.setItem(itemMem, event.target.value)});         
}

function responseJSON(event) {
  if(event.target.status === 200) {
    const response = JSON.parse(event.target.responseText);
    switch(event.target.responseURL) {
      case colorURL:
        fillSwatch(response, colorSwatch, colorSnippet, 'color', colorsForChoice);
        break;
      case sizeURL:
        fillSwatch(response, sizeSwatch, sizeSnippet, 'size', sizesForChoice);  
        break;
      case busketURL:
        basketItems(response);
        break;
      default:
    }
  } 
}

function basketItems(itemsInBasket) {
  quickCart.innerHTML = '';
  let commonPrice = 0;
  for(let item in itemsInBasket) quickCart.innerHTML += itemInBasketSnippet(itemsInBasket[item]);
  
  for(let inCart of quickCart.querySelectorAll('.quick-cart-product')) {   
    let price = +inCart.querySelector('.quick-cart-product .quick-cart-product-wrap .s1').textContent.replace(/\D/g,'');
    let quant = +inCart.querySelector('.quick-cart-product .count').textContent;
    commonPrice += price * quant;
  }
  quickCart.innerHTML += basketSnippet(commonPrice);

   let itemsRemove = quickCart.querySelectorAll('.quick-cart-product .quick-cart-product-remove');
   for(let itemRemove of itemsRemove) {
     itemRemove.addEventListener("click", (event) => {
       const formData = new FormData();
       formData.append('productId', event.target.getAttribute('data-id')); 
       const xhr = new XMLHttpRequest(); 
       xhr.addEventListener("load", responsePostCart);
       xhr.open('POST', `${busketURL}/remove`); 
       xhr.send(formData);   
     });
   }  
}

function addItemToBasket() { 
  event.preventDefault(); 
  const formData = new FormData(cartForm);
  formData.append('productId', cartForm.getAttribute('data-product-id'));  
  const xhr = new XMLHttpRequest(); 
  xhr.addEventListener("load", responsePostCart);
  xhr.open('POST', busketURL); 
  xhr.send(formData);
}

function responsePostCart(event) {
  let responseText = JSON.parse(event.target.responseText);
  responseText.error ? console.log(`${responseText.message}`) : basketItems(responseText);
}

const requestColors = new XMLHttpRequest();
requestColors.addEventListener("load", responseJSON);//loadColors);
requestColors.open('GET', colorURL);
requestColors.send();

const requestSizes = new XMLHttpRequest();
requestSizes.addEventListener("load", responseJSON);//loadSizes);
requestSizes.open('GET', sizeURL);
requestSizes.send();

const requestBasket = new XMLHttpRequest();
requestBasket.addEventListener("load", responseJSON);//loadBasket);
requestBasket.open('GET', busketURL);
requestBasket.send();


function colorSnippet(item, check) {
  return `<div data-value="${item.type}" class="swatch-element color ${item.type} ${item.isAvailable ? 'available' : 'soldout'}">
            <div class="tooltip">${item.title}</div>
            <input quickbeam="color" id="swatch-1-${item.code}" type="radio" name="color" value="${item.type}" ${item.isAvailable ? '' : 'disabled'} ${item.type == check ? 'checked' : ''}>
            <label for="swatch-1-${item.code}" style="border-color: ${item.code};">
              <span style="background-color: ${item.code};"></span>
              <img class="crossed-out" src="https://neto-api.herokuapp.com/hj/3.3/cart/soldout.png?10994296540668815886">
            </label>
          </div>`; 
}

function sizeSnippet(item, check) {
  return `<div data-value="${item.type}" class="swatch-element plain ${item.type} ${item.isAvailable ? 'available' : 'soldout'}">
            <input id="swatch-0-${item.type}" type="radio" name="size" value="${item.type}" ${item.isAvailable ? '' : 'disabled'} ${item.type == check ? 'checked' : ''}>
            <label for="swatch-0-${item.type}">
              ${item.title}
              <img class="crossed-out" src="https://neto-api.herokuapp.com/hj/3.3/cart/soldout.png?10994296540668815886">
           </label>
         </div>`; 
}

function itemInBasketSnippet(item) {
  return `<div class="quick-cart-product quick-cart-product-static" id="quick-cart-product-${item.id}" style="opacity: 1;">
           <div class="quick-cart-product-wrap">
             <img src="${item.pic}" title="${item.title}">
             <span class="s1" style="background-color: #000; opacity: .5">$${item.price}</span>
             <span class="s2"></span>
           </div>
           <span class="count hide fadeUp" id="quick-cart-product-count-${item.id}">${item.quantity}</span>
           <span class="quick-cart-product-remove remove" data-id="${item.id}"></span>
          </div>`;
}

function basketSnippet(commonPrice) {
  return `<a id="quick-cart-pay" quickbeam="cart-pay" class="cart-ico  ${commonPrice > 0 ? 'open' : ''}">
            <span>
              <strong class="quick-cart-text">Оформить заказ<br></strong>
              <span id="quick-cart-price">$${commonPrice}</span>
            </span>
          </a>`;
}

const cartForm = document.querySelector('#AddToCartForm');
const sizeSwatch = cartForm.querySelector('.swatches #sizeSwatch');
const sizesForChoice = cartForm.querySelector('#sizeSwatch');
const colorSwatch = cartForm.querySelector('.swatches #colorSwatch');
const colorsForChoice = cartForm.querySelector('#colorSwatch');
const quickCart = document.querySelector('#quick-cart');

const itemToBasket = document.querySelector('#AddToCart');
itemToBasket.addEventListener("click", addItemToBasket);


