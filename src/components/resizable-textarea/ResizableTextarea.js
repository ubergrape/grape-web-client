import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { pickHTMLProps } from 'pick-react-known-prop'

export default class Editable extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    focused: PropTypes.bool,
    readOnly: PropTypes.bool,
    value: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    disabled: false,
    focused: false,
    readOnly: false,
    placeholder: '',
  }

  componentDidMount() {
    this.setTextareaHeight()
    if (this.props.focused) this.textAreaRef.focus()
  }

  componentDidUpdate(prevProps) {
    this.setTextareaHeight()
    if (this.props.focused && !prevProps.focused) this.textAreaRef.focus()
  }

  setTextareaHeight() {
    this.textAreaRef.style.height = 0
    this.textAreaRef.style.height = `${this.textAreaRef.scrollHeight}px`
  }

  setTextAreaRef = ref => {
    this.textAreaRef = ref
  }

  render() {
    const { classes } = this.props.theme
    return (
      <textarea
        {...pickHTMLProps(this.props)}
        className={classes.input}
        ref={this.setTextareaRef}
      />
    )
  }
}
