import React from 'react'
import {FormattedMessage} from 'react-intl'

import * as types from '../../constants/alerts'

export default function getAlertText(type) {
  switch (type) {
    case types.RECONNECTED:
      return (
        <FormattedMessage
          id="reconnectAlert"
          defaultMessage="Reconnected successfully." />
      )
    case types.URL_NOT_FOUND:
      return (
        <FormattedMessage
          id="noRoomFound"
          defaultMessage="We could not find what you were looking for&nbsp;- the room might have been deleted, renamed or moved." />
      )
    case types.MESSAGE_NOT_FOUND:
      return (
        <FormattedMessage
          id="noMessageFound"
          defaultMessage="We could not find the message you were looking for." />
      )
    case types.MESSAGE_TO_SELF:
      return (
        <FormattedMessage
          id="cantMessageYourself"
          defaultMessage="You cannot message yourself." />
      )
    case types.LOADING_HISTORY:
      return (
        <FormattedMessage
          id="loadingChatHistory"
          defaultMessage="Loading your chat history…" />
      )
    default:
      return ''
  }
}
