import React, {Component, PropTypes} from 'react'

export default class Editable extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    value: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    error: PropTypes.string,
    placeholder: PropTypes.string
  }

  componentDidMount() {
    const {textarea} = this.refs
    if (textarea) textarea.style.height = `${textarea.scrollHeight}px`
  }

  componentDidUpdate() {
    const {textarea} = this.refs
    if (textarea) textarea.style.height = `${textarea.scrollHeight}px`
  }

  render() {
    switch (this.props.type) {
      case 'input':
        return <input {...this.props} />
      case 'textarea':
        return <textarea {...this.props} ref="textarea" />
      default:
        return null
    }
  }
}
