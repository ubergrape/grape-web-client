import isEmpty from 'lodash/isEmpty'

import { userStatusMap } from '../../../constants/app'
import isChromeOrFirefox from '../../../utils/is-chrome-or-firefox'
import messages from './messages'

export default ({ channel, user }) => {
  if (userStatusMap[user.status] === 'inCall') {
    if (channel.type === 'room') {
      // Current user participating in another call
      if (isEmpty(channel.calls)) {
        return {
          icon: 'camera',
          type: 'button',
          className: 'disabledCamera',
          message: messages.anotherCall,
          onClick: 'showOnCallToast',
        }
      }

      // Current user already participating in call in this channel
      return {
        icon: 'cameraActive',
        type: 'button',
        className: 'disabledCamera',
        message: messages.inCall,
        onClick: 'showOnAnotherCallToast',
      }
    }

    // Partner participating in another call
    if (
      channel.type === 'pm' &&
      userStatusMap[channel.partner.status] === 'inCall'
    ) {
      return {
        icon: 'camera',
        type: 'button',
        className: 'disabledCamera',
        message: messages.inCall,
        onClick: 'showOnCallToast',
      }
    }
  }

  if (!isEmpty(channel.calls)) {
    // Join ongoing call
    if (isChromeOrFirefox) {
      return {
        icon: 'cameraActive',
        type: 'link',
        className: 'cameraActive',
        message: messages.joinConference,
        link: channel.grapecallUrl,
      }
    }

    // Show warning for unsupported browser
    return {
      icon: 'cameraActive',
      type: 'button',
      className: 'cameraActive',
      message: messages.joinConference,
      onClick: 'showVideoConferenceWarning',
    }
  }

  // Start new call
  if (isChromeOrFirefox) {
    return {
      icon: 'camera',
      type: 'link',
      className: 'camera',
      message: messages.joinConference,
      link: channel.grapecallUrl,
    }
  }

  // Show warning for unsupported browser
  return {
    icon: 'camera',
    type: 'button',
    className: 'camera',
    message: messages.joinConference,
    onClick: 'showVideoConferenceWarning',
  }
}
