import * as types from '../constants/actionTypes'

export const initial = {}

export const states = {
  [types.SET_CONF]: (state, payload) => ({ ...payload }),
}
