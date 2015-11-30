import {createElement} from 'react'
import {render} from 'react-dom'

export default function setup(store, createComponent) {
  const elem = document.body.appendChild(document.createElement('div'))
  const component = render(createElement(createComponent(store)), elem)
  return {component, elem}
}
