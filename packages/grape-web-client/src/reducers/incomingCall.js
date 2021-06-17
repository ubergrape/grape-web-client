import * as types from '../constants/actionTypes'

export const initialState = {
  show: false,
  data: {},
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case types.HANDLE_INCOMING_CALL:
      return {
        ...state,
        data: payload,
      }
    case types.SHOW_INCOMING_CALL:
      return {
        ...state,
        show: true,
      }
    case types.CLOSE_INCOMING_CALL:
      return {
        ...state,
        show: false,
      }
    case types.CLEAR_INCOMING_CALL_DATA:
      return {
        ...state,
        data: {},
      }
    default:
      return state
  }
}
