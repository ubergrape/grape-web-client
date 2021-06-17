import isCircular from 'is-circular'

export default () => next => action => {
  if (isCircular(action)) {
    // eslint-disable-next-line no-console
    console.warn('Circular action detected', action)
  }
  return next(action)
}
