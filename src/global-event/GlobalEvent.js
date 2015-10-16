import {Component} from 'react'

// TODO
// - rename to react-event
// - enable children to be emitter
// - enable debounce, throttle
// - use onClick etc instead of events
export default class GlobalEvent extends Component {
  static defaultProps = {
    emitter: window,
    event: undefined,
    handler: undefined,
    debounce: 0
  }

  constructor(props) {
    super(props)
    this.handler = ::this.handler
  }

  componentDidMount() {
    this.props.emitter.addEventListener(this.props.event, this.handler)
  }

  componentWillUnmount() {
    this.props.emitter.removeEventListener(this.props.event, this.handler)
  }

  handler(e) {
    if (this.props.debounce) {
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        this.props.handler(e)
      })
    }
    else this.props.handler(e)
  }

  render() {
    return this.props.children || null
  }
}
