import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import ResizableTextarea from '../resizable-textarea/ResizableTextarea'

export default class Editable extends Component {
  static propTypes = {
    multiline: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    focused: PropTypes.bool.isRequired,
    onError: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    value: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    placeholder: PropTypes.string
  }

  componentDidMount() {
    this.editable = findDOMNode(this.refs.editable)
  }

  componentDidUpdate(prevProps) {
    const {focused, value, error, onError} = this.props
    const {editable} = this

    if (focused && !prevProps.focused) {
      editable.focus()
      editable.selectionStart = 0
      editable.selectionEnd = value.length
    }

    if (error) {
      editable.setCustomValidity(error)
      onError()
    } else {
      editable.setCustomValidity('')
    }
  }

  render() {
    if (this.props.multiline) {
      return <ResizableTextarea ref="editable" {...this.props} />
    }
    return <input ref="editable" {...this.props} />
  }
}
