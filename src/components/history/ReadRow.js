import PropTypes from 'prop-types'
import {PureComponent} from 'react'
import noop from 'lodash/utility/noop'
import debounce from 'lodash/function/debounce'

export default class ReadRow extends PureComponent {
  static propTypes = {
    channelId: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        message: PropTypes.shape({
          time: PropTypes.instanceOf(Date).isRequired
        })
      })
    ).isRequired,
    onRead: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    onRead: noop,
    children: noop
  }

  componentDidMount() {
    this.onFocusListener = window.addEventListener('focus', () => {
      this.onReadDebounced(this.lastVisibleMessageId)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.channelId !== this.props.channelId) {
      this.lastReadRow = undefined
    }
  }

  componentWillUnmount() {
    window.removeEventListener('focus', this.onFocusListener)
  }

  onRowsRendered = ({stopIndex}) => {
    const row = this.props.rows[stopIndex]

    if (!row) return

    // We are not sending a "read" event for every message, only for the latest one.
    // Backend assumes once user read the latest message, he read all older messages too.
    if (!this.lastReadRow || this.lastReadRow.message.time < row.message.time) {
      this.lastReadRow = row
      // We debounce it to reduce the amount of "read" events.
      this.onReadDebounced(row.id)
    }
  }

  onReadDebounced = debounce((messageId) => {
    // In case the window is not focused and the user receives a message we don't want
    // to mark it as read, but store last rendered messages to mark it as read once the
    // user focuses the window again.
    if (document.hasFocus()) {
      this.props.onRead({
        channelId: this.props.channelId,
        messageId
      })
    } else {
      this.lastVisibleMessageId = messageId
    }
  }, 1000)

  render() {
    return this.props.children({onRowsRendered: this.onRowsRendered})
  }
}
