import * as types from '../constants/actionTypes'

export const initial = {}

export const states = {
  [types.SET_TIMER]: (state, payload) => ({ ...payload }),
  [types.UPDATE_TIMER]: state => ({
    ...state,
    backoff: state.backoff - 1,
  }),
}
