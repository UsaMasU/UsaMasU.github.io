'use strict';

function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  const element = document.createElement(node.name);

  if (typeof node.props === 'object' && node.props !== null) {
    Object.keys(node.props).forEach(i => {
      element.setAttribute(i, node.props[i]);
      if(node.props[i] == 'main-content') {
        element.style.border = 'dashed red';
      }
    });
  }

  if (node.childs instanceof Array) {
    node.childs.forEach(child => {
      element.appendChild(createElement(child));
    });
  }
  return element;
}
