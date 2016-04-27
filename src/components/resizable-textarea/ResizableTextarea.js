import React, {Component, PropTypes} from 'react'

export default class Editable extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.string
  }

  static defaultProps = {
    placeholder: ''
  }

  componentDidMount() {
    this.setTextareaSize()
  }

  componentDidUpdate() {
    this.setTextareaSize()
  }

  setTextareaSize() {
    const {textarea} = this.refs
    textarea.style.height = 0
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  render() {
    return <textarea {...this.props} ref="textarea" />
  }
}
