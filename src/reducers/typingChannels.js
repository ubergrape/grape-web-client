import { findIndex } from 'lodash'

import * as types from '../constants/actionTypes'

const initialState = {}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_TYPING_USERS:
      return action.payload
    case types.HANDLE_USER_TYPING: {
      const { channelId, user } = action.payload
      const { id } = user
      const newState = { ...state }

      if (!newState[channelId]) {
        newState[channelId] = [{ ...user }]
        return newState
      }

      const index = findIndex(newState[channelId], { id })

      if (index === -1) {
        return {
          ...newState,
          [channelId]: newState[channelId].concat({ ...user }),
        }
      }

      newState[channelId].splice(index, 1, {
        ...user,
      })

      return newState
    }
    default:
      return state
  }
}
