'use strict';

const cardsLongPooling = document.querySelectorAll('.long-pooling div');

function loadLongPollingCard(event) {
  if(event.target.status >= 200 && event.target.status < 300) {
    if(event.target.responseText) {
      Array.from(cardsLongPooling)
        .forEach(card => {
          card.textContent === event.target.responseText.trim() ? card.classList.add('flip-it') : card.classList.remove('flip-it');
        });
    }
  }
  initLongPolling();
}

function initLongPolling() {
  const connLongPolling  = new XMLHttpRequest();
  connLongPolling.open('GET', 'https://neto-api.herokuapp.com/comet/long-pooling');
  connLongPolling.addEventListener('load', loadLongPollingCard);
  connLongPolling.send();
}

initLongPolling();
