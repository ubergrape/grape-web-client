export const getRandomElement = arr =>
  arr[Math.floor(Math.random() * arr.length)]

export const generateArray = (getElement, length) =>
  new Array(length).fill(null).map(() => {
    return getElement()
  })

export const generateArrayOfObjects = (getElement, length, arrayToMerge) =>
  new Array(length).fill(null).map((el, i) => {
    return {
      ...getElement(),
      ...(arrayToMerge && arrayToMerge[i]),
    }
  })

export const overwriteArray = (array, arrayToOverwrite) =>
  array.map((el, i) => ({
    ...array[i],
    ...arrayToOverwrite[i],
  }))

export const onError = (done, err) => {
  if (err) done.fail(err)
  done()
}
