import React, {PropTypes, Component} from 'react'
import keyname from 'keyname'
import noop from 'lodash/utility/noop'

export default class Textarea extends Component {
  static propTypes = {
    onKeyDown: PropTypes.func,
    onChange: PropTypes.func
  }

  static defaultProps = {
    onKeyDown: noop,
    onChange: noop
  }

  onEnter(e) {
    // Always insert a new line to be consistent across browsers.
    if (e.altKey || e.ctrlKey || e.shiftKey) {
      e.preventDefault()
      this.insertLineBreak()
      this.props.onChange(e)
    }

    // Do nothing if user tries to submit an empty text.
    if (!this.refs.textarea.value.trim()) {
      e.preventDefault()
      return
    }
  }

  onKeyDown(e) {
    const key = keyname(e.keyCode)
    switch (key) {
      case 'enter':
        this.onEnter(e)
        break
      default:
    }

    if (!e.defaultPrevented) this.props.onKeyDown(e)
  }

  insertLineBreak() {
    const {textarea} = this.refs
    const {selectionStart} = textarea

    textarea.value =
      textarea.value.substr(0, selectionStart) + '\n' +
      textarea.value.substr(selectionStart)

    textarea.selectionEnd = selectionStart + 1
  }

  render() {
    return (
      <textarea
        {...this.props}
        ref="textarea"
        autoFocus
        onKeyDown={::this.onKeyDown}></textarea>
    )
  }
}
