import * as types from '../constants/actionTypes'

const initialState = {}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.HANDLE_CHANNEL_MEMBERS:
      return {...state, users: action.payload}
    case types.REMOVE_USER_FROM_CHANNEL: {
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload.user.id)
      }
    }
    default:
      return state
  }
}
