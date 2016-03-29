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
      timeoutId: undefined
    }
  }

  componentWillReceiveProps(nextProps) {
    const {closeAfter} = nextProps
    if (closeAfter) {
      this.setState({
        timeoutId: setTimeout(() => {
          this.props.onCloseAfter()
        }, closeAfter)
      })
    }
  }

  componentWillUnmount() {
    if (this.state.timeoutId) clearTimeout(this.state.timeoutId)
  }

  render() {
    return <div>{this.props.children}</div>
  }
}
