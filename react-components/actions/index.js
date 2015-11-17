import * as types from '../constants/actionTypes'
import reduxEmitter from '../redux-emitter'

import page from 'page'
import {
  find as findChannel,
  getFileteredItems as getFileteredChannels
} from '../channel-search/utils'

export function setUser(user) {
  return {
    type: types.SET_USER,
    payload: {
      user
    }
  }
}

export function setOrg(org) {
  return {
    type: types.SET_ORG,
    payload: {
      org
    }
  }
}

export function showChannelSearch(org, user) {
  return {
    type: types.SHOW_CHANNEL_SEARCH,
    payload: {
      show: true,
      items: getFileteredChannels(org, user)
    }
  }
}

export function hideChannelSearch() {
  return {
    type: types.HIDE_CHANNEL_SEARCH,
    payload: {
      show: false,
      search: ''
    }
  }
}

export function inputChannelSearch(search, org, user) {
  return {
    type: types.INPUT_CHANNEL_SEARCH,
    payload: {
      search,
      items: findChannel(getFileteredChannels(org, user), search)
    }
  }
}

export function selectChannelSearch(channel) {
  page('/chat/' + channel.slug)
  return dispatch => dispatch(hideChannelSearch())
}

export function showRoomManager() {
  reduxEmitter.showRoomManager()
  return dispatch => {
    dispatch(hideChannelSearch())
  }
}
