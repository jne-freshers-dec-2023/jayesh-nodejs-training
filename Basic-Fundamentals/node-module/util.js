

 function convertToArray(arr) {

   const sortedArrays =  arr.sort((a,b) => a - b)
   return sortedArrays;
}

module.exports = convertToArray;

// export default convertToArray;