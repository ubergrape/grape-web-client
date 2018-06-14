import * as types from '../constants/actionTypes'
import conf from '../conf'

const initialState = {}

export default function reduce(state = initialState, action) {
  const { payload } = action

  switch (action.type) {
    case types.SET_CHANNEL:
      return { ...state, channel: payload.channel }
    case types.HANDLE_NOTIFICATION:
      if (conf.embed) return state
      return { ...state, notification: payload }
    default:
      return state
  }
}
