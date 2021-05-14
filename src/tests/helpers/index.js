export const getRandomElement = arr =>
  arr[Math.floor(Math.random() * arr.length)]

export const generateArray = (getElement, length, arrayToMerge) =>
  new Array(length).fill(null).map((el, i) => ({
    ...getElement(),
    ...(arrayToMerge && arrayToMerge[i]),
  }))

export const overwriteArray = (array, arrayToOverwrite) =>
  array.map((el, i) => ({
    ...array[i],
    ...arrayToOverwrite[i],
  }))
