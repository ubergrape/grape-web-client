import React, {PropTypes, Component} from 'react'
import keyname from 'keyname'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'

import style from './textareaStyle'

@useSheet(style)
export default class Textarea extends Component {
  static propTypes = {
    onKeyDown: PropTypes.func,
    onChange: PropTypes.func,
    className: PropTypes.string,
    sheet: PropTypes.object.isRequired
  }

  static defaultProps = {
    onKeyDown: noop,
    onChange: noop,
    className: ''
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
    const {classes} = this.props.sheet
    const {className} = this.props

    return (
      <textarea
        {...this.props}
        className={`${classes.textarea} ${className}`}
        ref="textarea"
        autoFocus
        onKeyDown={::this.onKeyDown}></textarea>
    )
  }
}
