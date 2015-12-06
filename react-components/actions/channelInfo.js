import * as types from '../constants/actionTypes'
import reduxEmitter from '../redux-emitter'

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
