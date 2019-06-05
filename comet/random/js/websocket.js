'use strict';

const cardsWebSocket = document.querySelectorAll('.websocket div');

const connectWebSocket = new WebSocket('wss://neto-api.herokuapp.com/comet/websocket');

connectWebSocket.addEventListener('message', event => {
  Array.from(cardsWebSocket)
    .forEach(card => {
      card.textContent === event.data ? card.classList.add('flip-it') : card.classList.remove('flip-it');
    });
});