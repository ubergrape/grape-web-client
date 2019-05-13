import * as types from '../constants/actionTypes'

export const initialState = {
  show: false,
  incoming: {},
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case types.HANDLE_INCOMING_CALL:
      return {
        ...state,
        show: true,
        incoming: payload,
      }
    case types.CLOSE_INCOMING_CALL:
      return {
        ...state,
        openTime: 0,
        incoming: {},
        show: false,
      }
    default:
      return state
  }
}
