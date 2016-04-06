import ReactDOM from 'react-dom'

/**
 * Sometimes default value of 10 is just not enough.
 */
Error.stackTraceLimit = 200

/**
 * Mount container for all components.
 */
let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  document.body.removeChild(container)
})

export function render(element, callback) {
  ReactDOM.render(element, container, callback)
}

/**
 * Its a simplified version of `querySelector` where name is space separated
 * list names. Those names need to be defined in data-test attributes.
 *
 * E.g. $('input wrapper something')
 */
export function $(names, parent = container) {
  let selector = ''
  names.split(' ').forEach(name => {
    selector += `[data-test="${name}"] `
  })
  return parent.querySelector(selector)
}
