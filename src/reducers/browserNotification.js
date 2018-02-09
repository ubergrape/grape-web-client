import * as types from '../constants/actionTypes'
import conf from '../conf'

const initialState = {}

export default function reduce(state = initialState, action) {
  const {payload} = action

  switch (action.type) {
    case types.SET_CHANNEL:
      return {...state, channel: payload.channel, showNotification: !conf.embed}
    case types.HANDLE_NOTIFICATION:
      return {...state, notification: payload, showNotification: !conf.embed}
    default:
      return state
  }
}
