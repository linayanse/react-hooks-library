const chai = require('chai') 

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

global.jestExpect = global.expect
global.expect = chai.expect
