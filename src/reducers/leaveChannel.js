import * as types from '../constants/actionTypes'

export const initial = {
  show: false,
}

export const states = {
  [types.SHOW_LEAVE_CHANNEL_DIALOG]: () => ({ show: true }),
  [types.HIDE_LEAVE_CHANNEL_DIALOG]: () => initial,
}
