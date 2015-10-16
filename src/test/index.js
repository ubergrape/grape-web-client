/**
 * Its a simplified version of `querySelector` where name is space separated
 * list names. Those names need to be defined in data-test attributes.
 *
 * E.g. $('input wrapper something')
 */
export function $(names) {
  let selector = ''

  names.split(' ').forEach(name => {
    selector += `[data-test="${name}"] `
  })

  return document.querySelector(selector)
}

afterEach(() => {
  document.body.innerHTML = ''
})
