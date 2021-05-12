import * as types from '../constants/actionTypes'

export const initial = {
  show: false,
}

export const states = {
  [types.SHOW_VIDEO_CONFERENCE]: () => ({ show: true }),
  [types.HIDE_VIDEO_CONFERENCE]: () => initial,
}
