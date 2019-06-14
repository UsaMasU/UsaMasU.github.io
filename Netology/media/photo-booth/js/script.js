'use strict';
  
const app = document.querySelector('.app');
const controls = document.querySelector('.controls');
const btnTakePhoto = controls.querySelector('#take-photo');
const errors = document.getElementById('error-message');
const listImages = document.querySelector('.list');

const video = document.createElement('video');
const audio = document.createElement('audio');

audio.src = './audio/click.mp3';

try {
  navigator.mediaDevices.getUserMedia({ audio: false, video: true })
    .then(function(stream) {
      video.srcObject = stream;
      video.onloadedmetadata = function(event) {
        video.play();
        app.appendChild(video);
        controls.style.display = 'flex';  
        btnTakePhoto.addEventListener('click', () => takePicture(stream));
      };
    })
    .catch(function(err) {
      errors.textContent = `Нет доступа к камере. Ошибка ${error.name}`;
      errors.style.display = 'block';
    });   
} catch(error) {
  errors.textContent = 'Ваш браузер не поддерживает mediaDevices';
  errors.style.display = 'block';
}

function createImgForList(imgURL) {
  return el('figure', {}, [
    el('img', {src: imgURL}),
    el('figcaption', {}, [
      el('a', {href: imgURL, download: 'snapshot.png'}, [
        el('i', {class: 'material-icons'}, 'file_download')
      ]),
      el('a', {}, [
        el('i', {class: 'material-icons'}, 'file_upload')
      ]),
      el('a', {}, [
        el('i', {class: 'material-icons'}, 'delete')
      ])
    ])
  ]);
}

function takePicture(stream) {
  const img = document.createElement('img');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let imgForList;
  let dataURL;
  let imageSend;
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0);
  
  canvas.toBlob(blob => {imageSend = blob});
  
  dataURL = canvas.toDataURL();
  imgForList = createImgForList(dataURL); 
  
  imgForList.addEventListener('click', event => {
    switch(event.target.textContent) {
      case 'file_download':
        event.target.style.display = 'none';
        break;
      case 'file_upload':   
        uploadPhoto(imageSend, event.target);
        break;
      case 'delete':
        event.currentTarget.remove();
        break;
    }
  });

  audio.play();
  listImages.appendChild(imgForList);
}


function el(tagName, attributes, children) {
  const element = document.createElement(tagName);
  if (typeof attributes === 'object') {
    Object.keys(attributes).forEach(i => element.setAttribute(i, attributes[i]));
  }
  if(typeof children === 'string') {
    element.textContent = children;
  } 
  else if (children instanceof Array) {
    children.forEach(child => element.appendChild(child));
  }
  return element;
}

function uploadPhoto(imageSend, target) {
  const data = new FormData();
  data.append('image', imageSend);
 
  const xhr = new XMLHttpRequest(); 
  xhr.open('POST', 'https://neto-api.herokuapp.com/photo-booth'); 
  xhr.onreadystatechange = function() {
    if (this.readyState != 4) return;
    target.style.display = 'none';
  }
  xhr.send(data);
}