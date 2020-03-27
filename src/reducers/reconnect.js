import * as types from '../constants/actionTypes'

const initialState = {
  reconnecting: false,
}

export default function reduce(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case types.SET_TIMER:
      return {
        ...state,
        backoff: payload,
      }
    case types.SET_OPEN_TIME:
      return {
        ...state,
        openTime: payload,
      }
    case types.HANDLE_RECONNECTING_CHANGE:
      return {
        ...state,
        reconnecting: payload,
      }
    case types.UPDATE_TIMER:
      return {
        ...state,
        backoff: state.backoff - 1,
      }
    default:
      return state
  }
}
