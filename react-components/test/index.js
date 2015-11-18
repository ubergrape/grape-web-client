export default function setup(store, initComponent) {
  const elem = document.body.appendChild(document.createElement('div'))
  const component = initComponent(store, elem)

  return {
    component,
    elem
  }
}
