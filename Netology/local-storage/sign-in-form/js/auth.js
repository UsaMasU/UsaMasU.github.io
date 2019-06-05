'use strict';

function signIn(event) {
  event.preventDefault();
  let jsonData = {};  
  const formFields = signInForm.querySelectorAll('input')
  for(let field of formFields) { 
    if(field.getAttribute('name')) jsonData[field.name] = field.value;
  }
  post(signInURL, jsonData);
}

function signUp(event) {
  event.preventDefault();
  let jsonData = {};  
  const formFields = signUpForm.querySelectorAll('input')
  for(let field of formFields) { 
    if(field.getAttribute('name')) jsonData[field.name] = field.value;
  }
  post(signUpURL, jsonData);
}

function post(url, data) {
  const xhr = new XMLHttpRequest(); 
  xhr.addEventListener("load", response);
  xhr.open('POST', url); 
  xhr.setRequestHeader('Content-Type', 'application/json'); 
  xhr.send(JSON.stringify(data));
}

function response(event) {
  try {
    let responseText = JSON.parse(event.target.responseText);
    switch(event.target.responseURL) {
      case signInURL:
        responseText.error ? signInMessage.value = `${responseText.message}` : signInMessage.value = `Пользователь ${responseText.name} успешно авторизован`;
        break;
      case signUpURL:
        responseText.error ? signUpMessage.value = `${responseText.message}` : signUpMessage.value = `Пользователь ${responseText.name} успешно зерегистрирован`;
        break;
      default:
        break;
    }
  }
  catch(err) {
    console.log(err);
  } 
}

const signInURL ='https://neto-api.herokuapp.com/signin';
const signUpURL ='https://neto-api.herokuapp.com/signup';
 
const signInForm = document.querySelector('.login-wrap .login-html .login-form .sign-in-htm');
const signInMessage = signInForm.querySelector('.error-message');
const signUpForm = document.querySelector('.login-wrap .login-html .login-form .sign-up-htm');
const signUpMessage = signUpForm.querySelector('.error-message');

const signInButton = signInForm.querySelector('.group .button');
const signUpButton = signUpForm.querySelector('.group .button');

signInButton.addEventListener('click', signIn); 
signUpButton.addEventListener('click', signUp); 
