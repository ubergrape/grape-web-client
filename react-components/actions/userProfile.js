import * as types from '../constants/actionTypes'
import reduxEmitter from '../redux-emitter'

export function showUserProfile() {
  reduxEmitter.showSidebar()
  return {
    type: types.SHOW_USER_PROFILE
  }
}

export function hideUserProfile() {
  reduxEmitter.hideSidebar()
  return {
    type: types.HIDE_USER_PROFILE
  }
}
