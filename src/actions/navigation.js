import * as types from '../constants/actionTypes'
import reduxEmitter from '../legacy/redux-emitter'

export function showChannelsManager() {
  return dispatch => {
    dispatch({
      type: types.SHOW_CHANNELS_MANAGER
    })
    reduxEmitter.showChannelsManager()
  }
}

export function showPmManager() {
  return dispatch => {
    dispatch({
      type: types.SHOW_PM_MANAGER
    })
    reduxEmitter.showPmManager()
  }
}
