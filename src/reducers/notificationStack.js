import * as types from '../constants/actionTypes'

const initialState = {
  notifications: []
}

export default function reduce(state = initialState, action) {
  const {payload} = action

  switch (action.type) {
    case types.REQUEST_ADD_NOTIFICATION_STACK:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          payload
        ]
      }
    case types.REQUEST_REMOVE_NOTIFICATION_STACK:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.key !== payload.key
        )
      }
    default:
      return state
  }
}
