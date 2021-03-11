import * as types from '../constants/actionTypes'

export const initial = {
  isCreateRoomOpened: false,
}

export const states = {
  [types.SHOW_CREATE_ROOM]: state => ({ ...state, isCreateRoomOpened: true }),
  [types.HIDE_CREATE_ROOM]: () => initial,
}
