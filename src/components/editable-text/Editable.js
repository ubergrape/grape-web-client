import React, {Component, PropTypes} from 'react'
import ResizableTextarea from '../resizable-textarea/ResizableTextarea'

/**
 * This component renders input or textarea
 * styled as text (transparent background etc..),
 * but once user clicks on it,
 * it becomes styled as textarea or input field.
 */
export default class EditableText extends Component {
  static propTypes = {
    multiline: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }

  componentWillReceiveProps(nextProps) {
    this.refs.editable.setCustomValidity(nextProps.error)
  }

  componentDidUpdate(prevProps) {
    if (this.props.isEditing && !prevProps.isEditing) {
      const {editable} = this.refs
      editable.focus()
      editable.selectionStart = 0
      editable.selectionEnd = this.props.value.length
    }
  }

  render() {
    if (this.props.multiline) {
      return <ResizableTextarea {...this.props} ref="editable" />
    }
    return <input {...this.props} ref="editable" />
  }
}
