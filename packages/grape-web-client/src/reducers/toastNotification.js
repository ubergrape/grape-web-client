import * as types from '../constants/actionTypes'

const initialState = {
  notifications: [],
}

export default function reduce(state = initialState, action) {
  const { payload } = action

  switch (action.type) {
    case types.SHOW_TOAST_NOTIFICATION:
      const isDuplicate = state.notifications.some(
        notification => notification.message === payload.message,
      )
      if (isDuplicate) return state
      return {
        ...state,
        notifications: [...state.notifications, payload],
      }
    case types.HIDE_TOAST_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.key !== payload.key,
        ),
      }
    case types.UPDATE_TOAST_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.map(
          notification =>
            notification.key === payload.key
              ? { ...notification, ...payload }
              : notification,
        ),
      }
    default:
      return state
  }
}
