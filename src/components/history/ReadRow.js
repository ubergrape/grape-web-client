import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import GlobalEvent from 'grape-web/lib/components/global-event'
import debounce from 'lodash/function/debounce'

export default class ReadRow extends PureComponent {
  static propTypes = {
    channelId: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        message: PropTypes.shape({
          time: PropTypes.instanceOf(Date).isRequired,
        }),
      }),
    ).isRequired,
    onRead: PropTypes.func.isRequired,
    selectedMessageId: PropTypes.string,
    children: PropTypes.func.isRequired,
  }

  static defaultProps = {
    selectedMessageId: undefined,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.channelId !== this.props.channelId) {
      this.lastReadRow = undefined
    }
  }

  onRowsRendered = ({ stopIndex }) => {
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

  onFocus = () => {
    const { rows, selectedMessageId } = this.props
    // lastVisibleMessageId can be undefined in case you just opened a chat from unfocused state.
    // In that case we will get selectedMessageId (if out path contain messageId) or
    // will pick last message from channel and mark it as read
    this.onReadDebounced(
      this.lastVisibleMessageId ||
        selectedMessageId ||
        rows[rows.length - 1].id,
    )
  }

  onReadDebounced = debounce(messageId => {
    // In case the window is not focused and the user receives a message we don't want
    // to mark it as read, but store last rendered messages to mark it as read once the
    // user focuses the window again.
    if (document.hasFocus()) {
      this.props.onRead({
        channelId: this.props.channelId,
        messageId,
      })
    } else {
      this.lastVisibleMessageId = messageId
    }
  }, 100)

  render() {
    return (
      <GlobalEvent event="focus" handler={this.onFocus}>
        {this.props.children({ onRowsRendered: this.onRowsRendered })}
      </GlobalEvent>
    )
  }
}
