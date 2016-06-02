import React, {Component, PropTypes} from 'react'

import useTheme from '../theme/useTheme'
import ResizableTextarea from '../resizable-textarea/ResizableTextarea'
import RawInput from '../input/Input'

/**
 * This component renders input or textarea
 * styled as text (transparent background etc..),
 * but once user clicks on it,
 * it becomes styled as textarea or input field.
 */
export default class Editable extends Component {
  static propTypes = {
    themes: PropTypes.object.isRequired,
    multiline: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    const {input, string} = props.themes
    this.input = {
      Input: useTheme(RawInput, input),
      String: useTheme(RawInput, string)
    }
    this.textarea = {
      Input: useTheme(ResizableTextarea, input),
      String: useTheme(ResizableTextarea, string)
    }
  }

  onEditableFocus = ({target}) => {
    target.selectionStart = 0
    target.selectionEnd = this.props.value.length
  }

  render() {
    const {isEditing} = this.props

    if (this.props.multiline) {
      const Textarea = this.textarea[isEditing ? 'Input' : 'String']
      return (
        <Textarea
        {...this.props}
        focused={isEditing}
        onFocus={this.onEditableFocus} />
      )
    }

    const Input = this.input[isEditing ? 'Input' : 'String']
    return (
      <Input
        {...this.props}
        focused={isEditing}
        onFocus={this.onEditableFocus} />
    )
  }
}
