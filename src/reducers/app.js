import * as types from '../constants/actionTypes'

const initialState = {
  show: 'splash',
  auth: 'nok'
}

export default function reduce(state = initialState, action) {
  const {payload} = action
  switch (action.type) {
    case types.SET_CHANNEL:
      return {
        ...state,
        channel: action.payload.channel
      }
    case types.HANDLE_AUTH_STATUS:
      return {
        ...state,
        auth: payload,
        show: payload === 'ok' ? 'app' : 'login'
      }
    default:
      return state
  }
}
