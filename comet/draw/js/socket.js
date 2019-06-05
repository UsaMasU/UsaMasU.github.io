'use strict';

const connection = new WebSocket('wss://neto-api.herokuapp.com/draw');

connection.addEventListener('open', event => {
  console.log('Вебсокет-соединение открыто');
});

editor.addEventListener('update', event => {
  event.canvas.toBlob(blob => {
    connection.send(blob);
  });
});
  
connection.addEventListener('message', event => {  
  console.log(event.data);
}); 

connection.addEventListener('close', event => {
  editor.removeEventListener('update');
});

connection.addEventListener('error', error => { 
  console.log(`Произошла ошибка: ${error.data}`); 
});

window.addEventListener('beforeunload', () => {
  connection.close(1000, 'Вебсокет-соединение закрыто');
});