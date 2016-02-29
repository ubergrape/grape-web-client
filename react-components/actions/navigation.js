import * as types from '../constants/actionTypes'
import reduxEmitter from '../redux-emitter'

export function showChannelsManager() {
  reduxEmitter.showChannelsManager()
  return {
    type: types.SHOW_CHANNELS_MANAGER
  }
}

export function showPmManager() {
  reduxEmitter.showPmManager()
  return {
    type: types.SHOW_PM_MANAGER
  }
}
