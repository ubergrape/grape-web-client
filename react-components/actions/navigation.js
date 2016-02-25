import * as types from '../constants/actionTypes'
import reduxEmitter from '../redux-emitter'

export function showChannelsManager() {
  reduxEmitter.showChannelsManager()
  return {
    type: types.SHOW_CHANNELS_MANAGER
  }
}

export function showPMsManager() {
  reduxEmitter.showPMsManager()
  return {
    type: types.SHOW_PMS_MANAGER
  }
}
