import { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { noop } from 'lodash'

export default class AutoHide extends PureComponent {
  static propTypes = {
    delay: PropTypes.number,
    onHide: PropTypes.func,
    data: PropTypes.object,
    children: PropTypes.node,
  }

  static defaultProps = {
    delay: undefined,
    children: undefined,
    data: undefined,
    onHide: noop,
  }

  state = { timeoutId: undefined }

  componentWillReceiveProps(nextProps) {
    const { delay, data } = nextProps
    if (delay) {
      this.setState({
        timeoutId: setTimeout(() => {
          this.props.onHide(data)
        }, delay),
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
