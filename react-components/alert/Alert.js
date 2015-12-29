import React, {Component, PropTypes} from 'react'

export default class Alert extends Component {
  static propTypes = {
    closeAfter: PropTypes.number,
    onCloseAfter: PropTypes.func,
    children: PropTypes.node
  }

  constructor(props) {
    super(props)
    this.state = {
      timer: undefined
    }
  }

  componentWillMount() {
    const {closeAfter} = this.props
    if (closeAfter) {
      this.setState({
        timer: setTimeout(() => {
          this.props.onCloseAfter()
        }, closeAfter)
      })
    }
  }

  componentWillUnmount() {
    if (this.state.timer) clearTimeout(this.state.timer)
  }

  render() {
    return <span>{this.props.children}</span>
  }
}
