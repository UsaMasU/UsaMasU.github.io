'use strict';

const cardsPooling = document.querySelectorAll('.pooling div');

function loadPollingCard(event) {
  if(event.target.status >= 200 && event.target.status < 300) {
    Array.from(cardsPooling)
      .forEach(card => {
        card.textContent === event.target.responseText ? card.classList.add('flip-it') : card.classList.remove('flip-it');
      });
  }
}

function initPolling() {
  const connPolling = new XMLHttpRequest();
  connPolling.open('GET', 'https://neto-api.herokuapp.com/comet/pooling');
  connPolling.addEventListener('load', loadPollingCard);
  connPolling.send();
}

setInterval(initPolling, 5000);