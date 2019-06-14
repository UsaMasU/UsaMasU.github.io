'use strict';

function createComment(comment) {
  const photo = document.createElement("div");
  photo.className = "photo";
  photo.setAttribute("title", comment.author.name);
  
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.style.backgroundImage = `url('${comment.author.pic}')`;
  
  const textBlock = document.createElement("div");
  textBlock.className = "comment-block";

  const text = document.createElement("p");
  text.style.whiteSpace = "pre-wrap";
  text.textContent = comment.text + '\n\r';

  const bottomComment = document.createElement("div");
  bottomComment.className = "bottom-comment";
  
  const commentDate = document.createElement("div");
  commentDate.className = "comment-date";
  commentDate.textContent = new Date(comment.date).toLocaleString('ru-Ru');

  const bottomActions = document.createElement("ul");
  bottomActions.className = "comment-actions";
  
  const complain = document.createElement("li");
  complain.className = "complain";
  complain.textContent = 'Пожаловаться';
  
  const reply = document.createElement("li");
  reply.className = "reply";
  reply.textContent = 'Ответить';          
  
  const commentWrap = document.createElement("div");
    commentWrap.className = "comment-wrap";
    commentWrap.appendChild(photo);  
      photo.appendChild(avatar);
    commentWrap.appendChild(textBlock);
      textBlock.appendChild(text);
      textBlock.appendChild(bottomComment);
        bottomComment.appendChild(commentDate);
        bottomComment.appendChild(bottomActions);
          bottomActions.appendChild(complain);
          bottomActions.appendChild(reply); 
   
  return commentWrap;
}

function showComments(list) {
  const commentsContainer = document.querySelector(".comments");
  const commentNodes = list.map(createComment);
  
  const fragment = commentNodes.reduce((fragment, currentValue) => {
    fragment.appendChild(currentValue);
    return fragment;
  }, document.createDocumentFragment());
  
  commentsContainer.appendChild(fragment);
}

fetch('https://neto-api.herokuapp.com/comments')
  .then(res => res.json())
  .then(showComments);
