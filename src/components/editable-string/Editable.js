import React, {Component, PropTypes} from 'react'
import ResizableTextarea from '../resizable-textarea/ResizableTextarea'

export default class Editable extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    value: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    placeholder: PropTypes.string
  }

  render() {
    switch (this.props.type) {
      case 'input':
        return <input {...this.props} />
      case 'textarea':
        return <ResizableTextarea {...this.props} />
      default:
        return null
    }
  }
}
