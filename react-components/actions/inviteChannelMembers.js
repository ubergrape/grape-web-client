import reduxEmitter from '../redux-emitter'
import * as types from '../constants/actionTypes'


export function addToInviteList(user) {
  return {
    type: types.ADD_TO_INVITE_LIST,
    payload: user
  }
}

export function removeFromInviteList(user) {
  return {
    type: types.REMOVE_FROM_INVITE_LIST,
    payload: user
  }
}
