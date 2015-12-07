import * as types from '../constants/actionTypes'
import reduxEmitter from '../redux-emitter'
import store from '../app/store'
import {channelSelector} from '../selectors'
import {showUserProfile} from './userProfile'

export function showChannelInfo() {
  reduxEmitter.showSidebar()
  return {
    type: types.SHOW_CHANNEL_INFO,
    payload: {
      show: true
    }
  }
}

export function hideChannelInfo() {
  reduxEmitter.hideSidebar()
  return {
    type: types.HIDE_CHANNEL_INFO,
    payload: {
      show: false
    }
  }
}

export function showChannelInfoOrUserProfile() {
  const channel = channelSelector(store.getState())
  if (channel.type === 'pm') return showUserProfile()
  return showChannelInfo()
}
