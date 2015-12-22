import find from 'lodash/collection/find'

import * as types from '../constants/actionTypes'
import reduxEmitter from '../redux-emitter'
import store from '../app/store'
import {channelSelector, usersSelector} from '../selectors'
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

export function showChannelInfoOrUserProfile() {
  const channel = channelSelector(store.getState())
  if (channel.type === 'pm') return showUserProfile()
  return showChannelInfo()
}

export function addUserToChannel(userId, channelId) {
  const state = store.getState()
  const currentChannel = channelSelector(state)

  if (currentChannel.id !== channelId) return {type: types.NOOP}

  const users = usersSelector(state)
  const user = find(users, ({id}) => id === userId)
  currentChannel.users.push(user)

  return {
    type: types.ADD_USER_TO_CURRENT_CHANNEL,
    payload: {
      channel: {...currentChannel}
    }
  }
}
