import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import useTheme from '../theme/useTheme'
import ResizableTextarea from '../resizable-textarea/ResizableTextarea'
import RawInput from '../input/Input'

/**
 * This component renders input or textarea
 * styled as text (transparent background etc..),
 * but once user clicks on it,
 * it becomes styled as textarea or input field.
 */
export default class Editable extends PureComponent {
  static propTypes = {
    themes: PropTypes.object.isRequired,
    multiline: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    const { input, string } = props.themes
    this.input = {
      Input: useTheme(RawInput, input),
      String: useTheme(RawInput, string),
    }
    this.textarea = {
      Input: useTheme(ResizableTextarea, input),
      String: useTheme(ResizableTextarea, string),
    }
  }

  onFocusEditable = ({ target }) => {
    target.selectionStart = 0
    target.selectionEnd = this.props.value.length
  }

  render() {
    const { isEditing, multiline } = this.props
    const tag = multiline ? 'textarea' : 'input'
    const Renderable = this[tag][isEditing ? 'Input' : 'String']

    return (
      <Renderable
        {...this.props}
        focused={isEditing}
        onFocus={this.onFocusEditable}
      />
    )
  }
}
