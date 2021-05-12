import * as types from '../constants/actionTypes'

export const initial = {
  show: false,
  step: 0,
}

export const states = {
  [types.SHOW_INTRO]: state => ({ ...state, show: true }),
  [types.SHOW_NEXT_INTRO]: state => ({ ...state, step: state.step + 1 }),
  [types.HIDE_INTRO]: () => initial,
}
