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

  constructor(props) {
    super(props)
    this.state = {
      timeoutId: undefined,
    }
  }

  componentDidMount() {
    const { delay } = this.props
    if (delay) {
      this.setTimeoutId()
    }
  }

  componentWillUnmount() {
    if (this.state.timeoutId) clearTimeout(this.state.timeoutId)
  }

  setTimeoutId = () => {
    const { onHide, data, delay } = this.props
    this.setState({
      timeoutId: setTimeout(() => {
        onHide(data)
      }, delay),
    })
  }

  render() {
    return this.props.children
  }
}
