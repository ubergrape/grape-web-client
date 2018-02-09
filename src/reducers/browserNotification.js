import * as types from '../constants/actionTypes'
import conf from '../conf'

const initialState = {}

export default function reduce(state = initialState, action) {
  const {payload} = action

  switch (action.type) {
    case types.SET_CHANNEL:
      return {...state, channel: conf.embed ? undefined : payload.channel}
    case types.HANDLE_NOTIFICATION:
      return {...state, notification: conf.embed ? undefined : payload}
    default:
      return state
  }
}
