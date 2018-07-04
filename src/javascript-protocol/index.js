/* eslint-disable no-script-url */
const parser = document.createElement('a')

export default url => {
  parser.href = encodeURI(url)
  return parser.protocol === 'javascript:'
}
