export const arrayMean = (array) => {
  if(array.length > 0){
    return array.reduce((a, b) => a + b) / array.length
  } else {
    return null
  }
  
};

export const onlyUnique = (value, index, array) => {
    return array.indexOf(value) === index;
  }
  