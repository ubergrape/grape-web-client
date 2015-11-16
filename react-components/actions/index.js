import * as types from '../constants/actionTypes'
import reduxEmitter from '../reduxEmitter'

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

export function channelSearchShow(org, user) {
  return {
    type: types.CHANNEL_SEARCH_SHOW,
    payload: {
      show: true,
      items: getFileteredChannels(org, user)
    }
  }
}

export function channelSearchHide() {
  return {
    type: types.CHANNEL_SEARCH_HIDE,
    payload: {
      show: false,
      search: ''
    }
  }
}

export function channelSearchInput(search, org, user) {
  return {
    type: types.CHANNEL_SEARCH_INPUT,
    payload: {
      search,
      items: findChannel(getFileteredChannels(org, user), search)
    }
  }
}

export function channelSearchSelect(channel) {
  page('/chat/' + channel.slug)
  return dispatch => dispatch(channelSearchHide())
}

export function showRoomManager() {
  reduxEmitter.showRoomManager()
  return dispatch => {
    dispatch(channelSearchHide())
  }
}
