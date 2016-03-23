import {createElement} from 'react'
import {render} from 'react-dom'

export default function setup(store, Component) {
  const elem = document.body.appendChild(document.createElement('div'))
  const component = render(createElement(Component), elem)
  return {component, elem}
}
