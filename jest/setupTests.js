// /** Jest test setup file. */
// const ReactDOM = require('react-dom');

// // optional
// window.requestAnimationFrame = callback => {
//   setTimeout(callback, 0);
// };

// // https://github.com/facebook/react/issues/11565
// ReactDOM.createPortal = node => node;

const chai = require('chai')
const jest = require('jest')

// Make sure chai and jasmine ".not" play nice together
const originalNot = Object.getOwnPropertyDescriptor(chai.Assertion.prototype, 'not').get

Object.defineProperty(chai.Assertion.prototype, 'not', {
  get() {
    Object.assign(this, this.assignedNot)
    return originalNot.apply(this)
  },
  set(newNot) {
    this.assignedNot = newNot
    return newNot
  },
})

global.jestExpect = jest.expect
global.chaiExpect = chai.expect
