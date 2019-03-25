/** Jest test setup file. */
const ReactDOM = require('react-dom');

// optional
window.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
};

// https://github.com/facebook/react/issues/11565
ReactDOM.createPortal = node => node;
