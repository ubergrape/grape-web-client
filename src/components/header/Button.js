import React, {Component, PropTypes} from 'react'

export default class Button extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string
  }

  render() {
    const {onClick, className} = this.props
    return (
      <button
        className={className}
        onClick={onClick}
        >
      </button>
    )
  }
}
