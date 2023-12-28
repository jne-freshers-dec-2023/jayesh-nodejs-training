
const convertToArray = require('./util')
const cta = require('./util')

// import cta from './util';

const numbers = [4, 2, 8, 1, 6];

// var sorted = convertToArray(numbers)     // named export
const sorted = cta(numbers)       // default export
console.log(sorted);
