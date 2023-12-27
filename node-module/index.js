
var convertToArray = require('./util')
var cta = require('./util')

// import cta from './util';

var numbers = [4, 2, 8, 1, 6];

// var sorted = convertToArray(numbers)     // named export
var sorted = cta(numbers)       // default export
console.log(sorted);
