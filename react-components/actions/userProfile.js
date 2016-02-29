import * as types from '../constants/actionTypes'
import reduxEmitter from '../redux-emitter'

export function showUserProfile() {
  return dispatch => {
    dispatch({
      type: types.SHOW_USER_PROFILE
    })
    reduxEmitter.showSidebar()
  }
}

export function hideUserProfile() {
  return dispatch => {
    dispatch({
      type: types.HIDE_USER_PROFILE
    })
    reduxEmitter.hideSidebar()
  }
}
