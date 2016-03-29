import * as types from '../../constants/alerts'

export default function getAlertText(type) {
  switch (type) {
    case types.RECONNECTED:
      return 'Reconnected successfully.'
    case types.URL_NOT_FOUND:
      return 'We could not find what you were looking for\xa0- the room might have been deleted, renamed or moved.'
    case types.MESSAGE_NOT_FOUND:
      return 'We could not find the message you were looking for.'
    case types.MESSAGE_TO_SELF:
      return 'You cannot message yourself.'
    case types.LOADING_HISTORY:
      return 'Loading your chat history\u2026'
    default:
      return ''
  }
}
