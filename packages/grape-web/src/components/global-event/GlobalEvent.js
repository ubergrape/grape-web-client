import PropTypes from 'prop-types'
import { Component } from 'react'

// TODO
// - rename to react-event
// - enable children to be emitter
// - enable throttle
// - use onClick etc instead of events
export default class GlobalEvent extends Component {
  static propTypes = {
    emitter: PropTypes.object,
    event: PropTypes.string.isRequired,
    debounce: PropTypes.number,
    handler: PropTypes.func.isRequired,
    children: PropTypes.element,
  }

  static defaultProps = {
    emitter: window,
    debounce: null,
    children: null,
  }

  componentDidMount() {
    this.props.emitter.addEventListener(this.props.event, this.handler)
  }

  componentWillUnmount() {
    this.props.emitter.removeEventListener(this.props.event, this.handler)
  }

  handler = e => {
    const { debounce, handler } = this.props

    if (debounce == null) {
      handler(e)
      return
    }

    clearTimeout(this.timeoutId)
    this.timeoutId = setTimeout(() => {
      handler(e)
    }, debounce)
  }

  render() {
    return this.props.children || null
  }
}
