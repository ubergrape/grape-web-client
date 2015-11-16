import * as types from '../constants/actionTypes'
import emitterToRedux from '../emitter-to-redux'

export function onUserSetted(user) {
  return {
    type: types.ON_USER_SETTED,
    payload: {
      user
    }
  }
}

export function onOrgReady(org) {
  return {
    type: types.ON_ORG_READY,
    payload: {
      org
    }
  }
}

export function channelSearchShow(items) {
  return {
    type: types.CHANNEL_SEARCH_SHOW,
    payload: {
      show: true,
      items
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

export function channelSearchInput(search, items) {
  return {
    type: types.CHANNEL_SEARCH_INPUT,
    payload: {
      search,
      items
    }
  }
}

export function callRoomManager() {
  emitterToRedux.onRoomManager()
  return dispatch => {
    dispatch(channelSearchHide())
  }
}
