import React from 'react'
import ReactDOM from 'react-dom'
import capitalize from 'lodash/string/capitalize'
import GrapeBrowser from './GrapeBrowser.js'

const eventTypes = [
  'onEditPrevious',
  'submit',
  'abort',
  'addIntegration',
  'insertItem',
  'blur',
  'focus',
  'complete',
  'change',
  'resize',
  'loadServices'
]

/**
 * GrapeBrowserReactive is a version of GrapeBrowser that supports
 * ReactiveElements. See https://github.com/PixelsCommander/ReactiveElements.
 */
export default class GrapeBrowserReactive extends React.Component {
  constructor(props) {
    super(props)
    eventTypes.forEach(e => {
      const name = `on${capitalize(e)}`
      this.handlers[name] = (data) => {
        if (this.props[name]) this.props[name](data)
        this.emit(e, data)
      }
    })
  }

  handlers = {}

  /**
   * Emit DOM event.
   */
  emit(type, data) {
    const capType = capitalize(type)
    let name = `grape${capType}`
    const event = new CustomEvent(name, {
      bubbles: true,
      cancelable: true,
      detail: data
    })
    ReactDOM.findDOMNode(this).dispatchEvent(event)
    name = `on${capType}`
    const callback = this.props[name]
    if (callback) callback(data)
  }

  render() {
    const props = {
      ...this.props,
      ...this.handlers
    }
    return <GrapeBrowser {...props} />
  }
}
