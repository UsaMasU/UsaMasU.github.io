'use strict';

if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function (constraints) {
    var getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }
    return new Promise((resolve, reject) => {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}

function createThumbnail(video) {
  return new Promise((done, fail) => {
    const preview = document.createElement('video');
    preview.src = URL.createObjectURL(video);
    preview.addEventListener('loadeddata', () => preview.currentTime = 2);
    preview.addEventListener('seeked', () => {
      const snapshot = document.createElement('canvas');
      const context = snapshot.getContext('2d');
      snapshot.width = preview.videoWidth;
      snapshot.height = preview.videoHeight;
      context.drawImage(preview, 0, 0);
      snapshot.toBlob(done);
    });
  });
}


function record(app) {
  return new Promise((done, fail) => {
    console.log('Switch on');
    app.mode = 'preparing';
    let recorder; 
    let recorded;
    let chunks = []; 
    let frame;
    let rec;
    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
      .then(function(stream) {
        console.log('Camera is active');                    
     
        recorder = new MediaRecorder(stream);                            
        recorder.addEventListener('dataavailable', (e) => {
          chunks.push(e.data);
        });
      
        app.preview.onloadedmetadata = function(e) {
          app.preview.play();
          setTimeout(() => {
            console.log('Start record');
            app.mode = 'recording';
            recorder.start();
          }, 1000);

          setTimeout(() => {
            app.preview.srcObject = null;
            stream.getTracks().forEach(track => track.stop())
            recorder.stop();  
          }, app.limit);
        }; 
      
        recorder.addEventListener('stop', (e) => {  
          console.log('stop record');
          stream.getTracks().forEach(track => track.stop());                        
          recorded = new Blob(chunks, { 'type' : recorder.mimeType });
          chunks = null; 
          recorder = stream = null; 
          console.log('video:', recorded);
        
          createThumbnail(recorded)
           .then(pic => {
            console.log('Take a photo');
            console.log('photo:', pic);
            done({'frame': pic, 'video': recorded});
          })
        });      
        app.preview.srcObject = stream;
      })
  })
}


