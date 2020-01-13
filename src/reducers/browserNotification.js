import * as types from '../constants/actionTypes'

const initialState = {}

export default function reduce(state = initialState, action) {
  const { payload } = action

  switch (action.type) {
    case types.HANDLE_NOTIFICATION:
      return {
        ...state,
        browserNotification: payload,
      }
    case types.SET_NOTIFICATION:
      return { ...state, notification: payload }
    default:
      return state
  }
}
