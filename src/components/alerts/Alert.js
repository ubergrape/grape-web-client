import {PureComponent} from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/utility/noop'

export default class Alert extends PureComponent {
  static propTypes = {
    closeAfter: PropTypes.number,
    onCloseAfter: PropTypes.func,
    data: PropTypes.object,
    children: PropTypes.node
  }

  static defaultProps = {
    closeAfter: undefined,
    children: undefined,
    data: undefined,
    onCloseAfter: noop
  }

  state = {timeoutId: undefined}

  componentWillReceiveProps(nextProps) {
    const {closeAfter, data} = nextProps
    if (closeAfter) {
      this.setState({
        timeoutId: setTimeout(() => {
          this.props.onCloseAfter(data)
        }, closeAfter)
      })
    }
  }

  componentWillUnmount() {
    if (this.state.timeoutId) clearTimeout(this.state.timeoutId)
  }

  render() {
    return this.props.children
  }
}
