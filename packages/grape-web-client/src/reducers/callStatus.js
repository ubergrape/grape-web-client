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
    case types.HANDLE_EXISTING_CALL:
      return {
        ...state,
        show: true,
        timer: parseInt(
          (new Date().getTime() - new Date(payload.call.started).getTime()) /
            1000,
          10,
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
        timer: payload,
      }
    default:
      return state
  }
}
