import * as types from '../constants/actionTypes'
import conf from '../conf'

const initialState = {}

export default function reduce(state = initialState, action) {
  const { payload } = action
  if (conf.embed) return state

  switch (action.type) {
    case types.SET_CHANNEL:
      return { ...state, channel: payload.channel }
    case types.HANDLE_NOTIFICATION:
      return {
        ...state,
        browserNotification: payload,
      }
    case types.SET_NOTIFICATION:
      return { ...state, notification: payload }
    default:
      return state
  }
}
