import {toCamel} from '../backend/convertCase'
import * as selectors from '../selectors'
import * as alerts from '../constants/alerts'
import store from '../app/store'
import boundActions from './boundActions'

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

      case 'message.new':
        boundActions.handleNewMessage(cData)
        break
      case 'message.removed':
        boundActions.handleRemovedMessage(cData)
        break

      case 'channel.typing':
        boundActions.setTyping(selectors.setTypingSelector(store.getState()), cData)
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
        boundActions.handleUpateChannel(cData)
        break
      case 'channel.removed':
        boundActions.handleRemoveRoom(cData)
        break

      case 'pins.changed':
        boundActions.handleFavoriteChange(cData)
        break

      case 'organization.joined':
        boundActions.handleJoinOrg(cData)
        break
      case 'organization.left':
        boundActions.handleLeftOrg(cData)
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

      default:
    }
  })

  channel.on('error', boundActions.handleConnectionError)
}
