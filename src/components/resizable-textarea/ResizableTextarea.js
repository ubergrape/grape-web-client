import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { pickHTMLProps } from 'pick-react-known-prop'

export default class Editable extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func,
    disabled: PropTypes.bool,
    focused: PropTypes.bool,
    readOnly: PropTypes.bool,
    value: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    placeholder: '',
  }

  componentDidMount() {
    this.setTextareaHeight()
    if (this.props.focused) this.refs.textarea.focus()
  }

  componentDidUpdate(prevProps) {
    this.setTextareaHeight()
    if (this.props.focused && !prevProps.focused) this.refs.textarea.focus()
  }

  setTextareaHeight() {
    const { textarea } = this.refs
    textarea.style.height = 0
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  render() {
    const { classes } = this.props.theme
    return (
      <textarea
        {...pickHTMLProps(this.props)}
        className={classes.input}
        ref="textarea"
      />
    )
  }
}
