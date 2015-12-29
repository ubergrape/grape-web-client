import React, {Component, PropTypes} from 'react'

export default class Alert extends Component {
  static propTypes = {
    closeAfter: PropTypes.number,
    onCloseAfter: PropTypes.func,
    children: PropTypes.node
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer)
  }

  render() {
    const {closeAfter} = this.props
    if (closeAfter) {
      this.timer = setTimeout(() => {
        this.props.onCloseAfter()
      }, closeAfter)
    }

    return <span>{this.props.children}</span>
  }
}
