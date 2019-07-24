import * as types from '../constants/actionTypes'

export const initialState = {
  show: false,
  timer: 0,
  call: {},
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case types.HANDLE_JOINED_CALL:
      return {
        ...state,
        show: true,
        timer: Math.floor((Date.now() - Date.parse(payload.startedAt)) / 60),
        call: payload,
      }
    case types.CLOSE_CALL_STATUS:
      return {
        ...state,
        show: false,
        timer: 0,
        call: {},
      }
    case types.UPDATE_CALL_STATUS_TIMER:
      return {
        ...state,
        timer: state.timer + 1,
      }
    default:
      return state
  }
}
