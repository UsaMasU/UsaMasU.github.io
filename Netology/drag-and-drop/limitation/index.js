'use strict';

const textArea = document.querySelector('.textarea');
const bullMessage = document.querySelector('.message');
const bullEyes = document.querySelector('.block');

textArea.addEventListener('focus', () => {
  bullEyes.classList.add('active')
});

textArea.addEventListener('blur', () => {
  bullEyes.classList.remove('active');
  bullMessage.classList.remove('view');
})

textArea.addEventListener('input', () => {
  bullEyes.classList.add('active');
  bullMessage.classList.remove('view');
});

textArea.addEventListener('keydown', debounce(() => {
  bullEyes.classList.remove('active');
  bullMessage.classList.add('view');
}, 2000));

function debounce(callback, delay) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      timeout = null;
      callback();
    }, delay);
  };
};