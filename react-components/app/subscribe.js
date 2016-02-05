import {toCamel} from '../backend/convertCase'
import * as selectors from '../selectors'
import * as alerts from '../constants/alerts'
import store from '../app/store'
import boundActions from './boundActions'
import {connectionType} from '../backend/client'
import request from 'superagent'

function reloadOnAuthError(error = {}) {
  if (error.status === 401) window.location.reload()
}

export default function subscribe(channel) {
  let showReconnectedAlert = false

  channel.on('connected', () => {
    if (showReconnectedAlert) {
      boundActions.hideAlertByType(alerts.CONNECTION_LOST)
      boundActions.showAlert({
        level: 'success',
        type: alerts.RECONNECTED,
        closeAfter: 2000
      })
    }
    showReconnectedAlert = true
  })

  channel.on('disconnected', () => {
    boundActions.showAlert({
      level: 'danger',
      type: alerts.CONNECTION_LOST
    })
  })

  channel.on('data', data => {
    const cData = toCamel(data)
    switch (cData.event) {
      case 'channel.typing':
        boundActions.setTyping(selectors.setTypingSelector(store.getState()), cData)
        break
      case 'message.new':
        boundActions.handleNewMessage(cData)
        break
      case 'message.removed':
        boundActions.handleRemovedMessage(cData)
        break
      case 'channel.joined':
        boundActions.handleJoinedChannel(cData)
        break
      case 'channel.read':
        boundActions.handleReadChannel(cData)
        break
      case 'channel.left':
        boundActions.handleLeftChannel(cData)
        break
      default:
    }
  })

  // https://github.com/ubergrape/chatgrape/issues/3291
  channel.on('error', err => {
    if (connectionType === 'lp') reloadOnAuthError(err)
    if (connectionType === 'ws') {
      request
        .get('/accounts/session_state')
        .end(reloadOnAuthError)
    }
  })
}
