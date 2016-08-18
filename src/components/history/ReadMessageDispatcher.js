import {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import shallowCompare from 'react-addons-shallow-compare'
import debounce from 'lodash/function/debounce'

export default class ReadMessageDispatcher extends Component {
  static propTypes = {
    channelId: PropTypes.number.isRequired,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        time: PropTypes.instanceOf(Date).isRequired
      })
    ).isRequired,
    onRead: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    onRead: noop,
    children: noop
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.channelId !== this.props.channelId) {
      this.lastReadMessage = undefined
    }

    return shallowCompare(this, nextProps, nextState)
  }

  onRowsRendered = ({stopIndex}) => {
    const message = this.props.messages[stopIndex]

    if (!message) return

    // We are not sending a "read" event for every message, only for the latest one.
    // Backend assumes once user read the latest message, he read all older messages too.
    if (!this.lastReadMessage || this.lastReadMessage.time < message.time) {
      this.lastReadMessage = message
      // We debounce it to reduce the amount of "read" events.
      this.onReadDebounced(message.id)
    }
  }

  onReadDebounced = debounce((messageId) => {
    this.props.onRead({
      channelId: this.props.channelId,
      messageId
    })
  }, 1000)

  render() {
    return this.props.children({onRowsRendered: this.onRowsRendered})
  }
}
