import * as types from '../constants/actionTypes'

const initialState = {
  users: [],
  isEveryMemberLoaded: false,
}

export default function reduce(state = initialState, action) {
  const { payload } = action
  switch (action.type) {
    case types.HANDLE_CHANNEL_MEMBERS:
      return { ...state, users: payload.users, isEveryMemberLoaded: false }
    case types.HANDLE_EVERY_MEMBER_LOADED:
      return { ...state, isEveryMemberLoaded: true }
    case types.ADD_USER_TO_CHANNEL: {
      if (state.users.some(({ id }) => id === payload.user.id))
        return { ...state }
      return {
        ...state,
        users: [...state.users, payload.user],
      }
    }
    case types.REMOVE_USER_FROM_CHANNEL: {
      return {
        ...state,
        users: state.users.filter(user => user.id !== payload.userId),
      }
    }
    default:
      return state
  }
}
