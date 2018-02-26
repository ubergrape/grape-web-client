import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'

import * as types from '../../constants/alerts'

export default class TextAlert extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired
  }

  render() {
    switch (this.props.type) {
      case types.RECONNECTED:
        return (
          <FormattedMessage
            id="reconnectAlert"
            defaultMessage="Reconnected successfully."
          />
        )
      case types.CHANNEL_NOT_FOUND:
        return (
          <FormattedMessage
            id="noRoomFound"
            defaultMessage="We could not find what you were looking for&nbsp;- the room might have been deleted, renamed or moved."
          />
        )
      case types.MESSAGE_NOT_FOUND:
        return (
          <FormattedMessage
            id="noMessageFound"
            defaultMessage="We could not find the message you were looking for."
          />
        )
      case types.MESSAGE_TO_SELF:
        return (
          <FormattedMessage
            id="cannotMessageYourself"
            defaultMessage="You cannot message yourself."
          />
        )
      case types.LOADING_HISTORY:
        return (
          <FormattedMessage
            id="loadingChatHistory"
            defaultMessage="Loading your chat history…"
          />
        )
      case types.CONNECTION_LOST:
        return (
          <FormattedMessage
            id="reconnectingAlert"
            defaultMessage="Lost connection to the server — trying to reconnect."
          />
        )
      default:
        return null
    }
  }
}
