import isEmpty from 'lodash/isEmpty'

import { userStatusMap } from '../../../constants/app'
import isChromeOrFirefox from '../../../utils/is-chrome-or-firefox'
import messages from './messages'

export default ({ channel, call }) => {
  if (isEmpty(call)) {
    if (isEmpty(channel.calls)) {
      // Partner with which user wants create call busy in another call
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

      // Start new all
      if (isChromeOrFirefox) {
        return {
          icon: 'camera',
          type: 'link',
          className: 'camera',
          message: messages.joinConference,
          link: channel.grapecallUrl,
        }
      }

      // Show warning for unsupported browsers
      return {
        icon: 'camera',
        type: 'button',
        className: 'camera',
        message: messages.joinConference,
        onClick: 'showVideoConferenceWarning',
      }
    }

    // Join existing call in current channel
    if (isChromeOrFirefox) {
      return {
        icon: 'cameraActive',
        type: 'link',
        className: 'cameraActive',
        message: messages.joinConference,
        link: channel.grapecallUrl,
      }
    }

    // Show warning for unsupported browsers
    return {
      icon: 'cameraActive',
      type: 'button',
      className: 'cameraActive',
      message: messages.joinConference,
      onClick: 'showVideoConferenceWarning',
    }
  }

  // User participating in call in another channel and picked channe don't have ongoing call
  if (isEmpty(channel.calls)) {
    return {
      icon: 'camera',
      type: 'button',
      className: 'disabledCamera',
      message: messages.anotherCall,
      onClick: 'showOnAnotherCallToast',
    }
  }

  // User participating in call in another channel and picked channel have ongoing call
  if (call.channel !== channel.id) {
    return {
      icon: 'cameraActive',
      type: 'button',
      className: 'disabledCamera',
      message: messages.inCall,
      onClick: 'showOnAnotherCallToast',
    }
  }

  // User participating in call in current channel, but can join unlimited times from same/another devices
  return {
    icon: 'cameraActive',
    type: 'link',
    className: 'cameraActive',
    message: messages.joinConference,
    link: channel.grapecallUrl,
  }
}
