/**
 * Mini svg manipulation for simple attributes manipulation only.
 */

import toArray from 'lodash/toArray'
import svg2base64 from '../jss-utils/svg2base64'

class List {
  constructor(dom, list) {
    this.dom = dom
    this.list = toArray(list)
  }

  each(fn) {
    this.list.forEach(fn)
    return this
  }

  attr(name, value) {
    this.each(node => node.setAttribute(name, value))
    return this
  }

  data(encoding) {
    return svg2base64(this.svg(), encoding)
  }

  svg() {
    return this.dom.el.innerHTML
  }

  node() {
    return this.dom.el.firstChild
  }
}

class Dom {
  constructor(svg) {
    this.el = document.createElement('div')
    this.el.innerHTML = svg
  }

  find(query) {
    return new List(this, this.el.querySelectorAll(query))
  }
}

export default function create(svg) {
  return new Dom(svg)
}
