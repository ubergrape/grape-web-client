import * as types from '../constants/actionTypes'
import reduxEmitter from '../legacy/redux-emitter'
import store from '../app/store'
import {channelSelector} from '../selectors'
import {showUserProfile} from './userProfile'

export function showRoomInfo() {
  reduxEmitter.showSidebar()
  return {
    type: types.SHOW_ROOM_INFO
  }
}

export function hideChannelInfo() {
  reduxEmitter.hideSidebar()
  return {
    type: types.HIDE_CHANNEL_INFO
  }
}

export function showChannelInfo() {
  const channel = channelSelector(store.getState())
  switch (channel.type) {
    case 'pm':
      return showUserProfile()
    case 'room':
      return showRoomInfo()
    default:
      return { type: types.NOOP }
  }
}
