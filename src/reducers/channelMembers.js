import * as types from '../constants/actionTypes'

const initialState = {
  users: [],
}

export default function reduce(state = initialState, action) {
  const { payload } = action
  switch (action.type) {
    case types.HANDLE_CHANNEL_MEMBERS:
      return { ...state, users: payload.users, totalMembers: payload.total }
    case types.ADD_USER_TO_CHANNEL: {
      if (state.users.some(({ id }) => id === payload.user.id))
        return { ...state }
      return {
        ...state,
        users: [...state.users, payload.user],
        totalMembers: state.totalMembers + 1,
      }
    }
    case types.REMOVE_USER_FROM_CHANNEL: {
      return {
        ...state,
        users: state.users.filter(user => user.id !== payload.userId),
        totalMembers: state.totalMembers - 1,
      }
    }
    default:
      return state
  }
}
