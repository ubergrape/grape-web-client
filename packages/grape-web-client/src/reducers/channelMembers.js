import findIndex from 'lodash/findIndex'
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
      if (payload.currentChannelId !== payload.channel.id) return state
      if (state.users.some(({ id }) => id === payload.user.id))
        return { ...state }
      return {
        ...state,
        users: [...state.users, payload.user],
      }
    }
    case types.CHANGE_SIDEBAR_USER_STATUS: {
      const newState = { ...state }
      const { users } = newState

      const index = findIndex(users, { id: payload.id })

      if (index === -1) return state

      const user = users[index]

      users.splice(index, 1, {
        ...user,
        status: payload.status,
      })

      return {
        ...newState,
        users,
      }
    }
    case types.REMOVE_USER_FROM_CHANNEL: {
      if (payload.currentChannelId !== payload.channelId) return state
      return {
        ...state,
        users: state.users.filter(user => user.id !== payload.userId),
      }
    }
    default:
      return state
  }
}
