import React, {PropTypes, Component} from 'react'
import keyname from 'keyname'
import noop from 'lodash/utility/noop'

let isAccentMode = false

export default class Textarea extends Component {
  static propTypes = {
    onKeyDown: PropTypes.func,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    onKeyDown: noop,
    onChange: noop,
    onSubmit: noop,
    className: '',
    placeholder: ''
  }

  onKeyDown(e) {
    isAccentMode = e.keyCode === 229
    const isEnter = keyname(e.keyCode) === 'enter'

    if (isEnter) {
      // Always insert a new line to be consistent across browsers.
      if (e.altKey || e.ctrlKey || e.shiftKey) {
        e.preventDefault()
        this.insertLineBreak()
        this.props.onChange(e)
        return
      }

      // Do nothing if user tries to submit an empty text.
      if (!this.refs.textarea.value.trim()) {
        e.preventDefault()
        return
      }
    }

    this.props.onKeyDown(e)

    if (isEnter && !e.defaultPrevented) {
      this.props.onSubmit(e)
    }
  }

  insertLineBreak() {
    const {textarea} = this.refs
    const {selectionStart, selectionEnd, value} = textarea

    textarea.value =
      value.substr(0, selectionStart) +
      '\n' +
      value.substr(selectionEnd)

    textarea.selectionEnd = selectionStart + 1
  }

  render() {
    let {props} = this
    if (isAccentMode) {
      props = {...props}
      delete props.value
    }
    console.log(props)
    return (
      <textarea
        {...props}
        ref="textarea"
        onKeyDown={::this.onKeyDown}></textarea>
    )
  }
}
