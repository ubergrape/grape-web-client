import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
}

export default function reduce(state = initialState, action) {
  const { payload } = action

  switch (action.type) {
    case types.SHOW_NOTIFICATION_SETTINGS:
      return {
        ...state,
        ...payload,
        show: true,
      }
    case types.HIDE_NOTIFICATION_SETTINGS:
      return {
        ...state,
        show: false,
      }
    case types.HANDLE_NOTIFICATION_SETTINGS:
      return {
        ...state,
        ...payload,
      }
    default:
      return state
  }
}
