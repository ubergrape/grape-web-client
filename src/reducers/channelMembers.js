import * as types from '../constants/actionTypes'

const initialState = {
  users: []
}

export default function reduce(state = initialState, action) {
  const {payload} = action
  switch (action.type) {
    case types.HANDLE_CHANNEL_MEMBERS:
      return {...state, users: payload}
    case types.REMOVE_USER_FROM_CHANNEL: {
      return {
        ...state,
        users: state.users.filter(user => user.id !== payload.user.id)
      }
    }
    default:
      return state
  }
}
