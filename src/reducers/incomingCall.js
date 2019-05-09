import * as types from '../constants/actionTypes'

export const initialState = {
  show: false,
  openTime: 0,
  timer: Math.floor(Date.now() / 1000),
  incoming: {},
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case types.HANDLE_INCOMING_CALL:
      return {
        ...state,
        show: true,
        openTime: Math.floor(Date.now() / 1000),
        timer: Math.floor(Date.now() / 1000),
        incoming: payload,
      }
    case types.CLOSE_INCOMING_CALL:
    case types.JOIN_INCOMING_CALL:
    case types.REJECT_INCOMING_CALL:
    case types.HANDLE_MISSED_CALL:
      return {
        ...state,
        openTime: 0,
        incoming: {},
        show: false,
      }
    case types.UPDATE_INCOMING_CALL_TIMER:
      return {
        ...state,
        timer: state.timer + 1,
      }
    default:
      return state
  }
}
