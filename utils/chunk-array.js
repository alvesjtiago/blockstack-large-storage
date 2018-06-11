function chunkArray(myArray, chunkSize) {
  let index = 0;
  const arrayLength = myArray.length;
  const tempArray = [];

  for (index = 0; index < arrayLength; index += chunkSize) {
    const chunk = myArray.slice(index, index + chunkSize);
    tempArray.push(chunk);
  }

  return tempArray;
}

export { chunkArray as default };
