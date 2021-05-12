import * as types from '../constants/actionTypes'

export const initialState = {
  show: false,
  timer: 0,
  data: {},
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case types.HANDLE_JOINED_CALL:
    case types.HANDLE_STARTED_CALL:
      return {
        ...state,
        show: true,
        timer: Math.floor(
          (Date.now() - Date.parse(payload.call.started)) / 1000,
        ),
        data: payload,
      }
    case types.CLOSE_CALL_STATUS:
      return {
        ...state,
        show: false,
        timer: 0,
        data: {},
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
