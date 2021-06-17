import { toCamel } from '../utils/convert-case'
import * as alerts from '../constants/alerts'
import conf from '../conf'
import getBoundActions from './boundActions'

export default function subscribe(channel) {
  const boundActions = getBoundActions()
  let id
  let showReconnectedAlert = false
  let isSuspended = false

  channel.on('connected', () => {
    boundActions.hideAlertByType(alerts.CONNECTION_LOST)
    if (showReconnectedAlert) {
      boundActions.showAlert({
        level: 'success',
        type: alerts.RECONNECTED,
        closeAfter: 2000,
      })
    }
    showReconnectedAlert = true
    isSuspended = false
  })

  channel.on('suspend', () => {
    isSuspended = true
    showReconnectedAlert = false
  })

  channel.on('disconnected', () => {
    if (!isSuspended) {
      boundActions.showAlert({
        level: 'danger',
        delay: 3000,
        type: alerts.CONNECTION_LOST,
      })
    }

    // TODO investigate why only embedded mode is not reloading history on connect
    // On the other hand full mode does it too many times.
    if (isSuspended && conf.embed) {
      channel.once('connected', () => {
        // We don't want to clear the history when client was suspended
        // over an API and then reconnected.
        // Clearing is used to enhance perceptional performance when clicked
        // on a navigation in order to react immediately.
        boundActions.loadHistory({ clear: false })
      })
    }
  })

  // Resync the whole data if we got a new client id, because we might have
  // missed some messages. This is related to the current serverside arch.
  channel.on('set:id', clientId => {
    boundActions.hideAlertByType(alerts.CONNECTION_LOST)
    if (id && clientId !== id) {
      boundActions.showAlert({
        level: 'success',
        type: alerts.RECONNECTED,
        closeAfter: 2000,
      })
    }
    id = clientId
    boundActions.loadInitialData(clientId)
  })

  channel.on('unauthorized', err => {
    boundActions.handleAuthError(err)
  })

  channel.on('data', data => {
    const cData = toCamel(data)
    switch (cData.event) {
      case 'notification.new':
        boundActions.handleNotification(cData)
        break
      case 'message.new':
        boundActions.handleNewMessage(cData)
        break
      case 'system_message.new':
        boundActions.handleNewSystemMessage(cData)
        break
      case 'message.removed':
        boundActions.handleRemovedMessage(cData)
        break
      case 'system_message.updated':
        boundActions.handleSystemMessageUpdate(cData)
        break
      case 'message.updated':
        boundActions.handleMessageUpdate(cData)
        break
      case 'message.labeled':
        boundActions.handleMessageLabeled(cData)
        break
      case 'channel.typing':
        boundActions.handleTypingNotification(cData)
        break
      case 'channel.new':
        boundActions.handleNewChannel(cData)
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
      case 'channel.updated':
        boundActions.handleUpdateChannel(cData)
        break
      case 'channel.removed':
        boundActions.handleRemoveRoom(cData)
        break
      case 'user.status':
        boundActions.handleUserStatusChange(cData)
        break
      case 'user.updated':
        boundActions.handleUserUpdate(cData)
        break
      case 'membership.updated':
        boundActions.handleMembershipUpdate(cData)
        break
      case 'pins.changed':
        boundActions.handleFavoriteChange(cData)
        break
      case 'call.incoming':
        boundActions.handleIncomingCall(cData)
        break
      case 'call.missed':
        boundActions.handleMissedCall(cData)
        break
      case 'call.hungup':
        boundActions.handleHungUpCall(cData)
        break
      case 'call.joined':
        boundActions.handleJoinedCall(cData)
        break
      case 'call.rejected':
        boundActions.handleRejectedCall(cData)
        break
      case 'call.started':
        boundActions.handleStartedCall(cData)
        break
      case 'call.finished':
        boundActions.handleFinishedCall(cData)
        break
      case 'ping':
        boundActions.handlePing(cData)
        break
      default:
    }
  })

  channel.on('error', boundActions.handleConnectionError)

  channel.on('set:timer', backoff => {
    boundActions.setTimer(parseInt(backoff / 1000, 10))
  })

  channel.on('set:reconnecting:state', () => {
    setTimeout(() => {
      boundActions.handleReconnecting(false)
    }, 1000)
  })
}
