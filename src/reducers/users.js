import findIndex from 'lodash/array/findIndex'

import * as types from '../constants/actionTypes'

const initialState = []

export default function reduce(state = initialState, action) {
  const {payload} = action

  switch (action.type) {
    case types.SET_USERS:
      return [...payload]

    case types.ADD_USER_TO_ORG:
      return [...state, payload]

    case types.REMOVE_USER_FROM_ORG: {
      const newState = [...state]
      const index = findIndex(newState, {id: payload})
      if (index === -1) return state
      const user = newState[index]
      newState.splice(index, 1, {
        ...user,
        isActive: false
      })
      return newState
    }

    case types.CHANGE_USER_STATUS: {
      const {userId: id, status} = payload

      const newState = [...state]
      const index = findIndex(newState, {id})
      if (index === -1) return state
      const user = newState[index]
      newState.splice(index, 1, {
        ...user,
        status
      })
      return newState
    }

    case types.UPDATE_USER: {
      const newState = [...state]
      const index = findIndex(newState, {id: payload.id})
      if (index === -1) return state
      const user = newState[index]
      const avatar = payload.avatar || user.avatar
      newState.splice(index, 1, {
        ...user,
        ...payload,
        avatar
      })
      return newState
    }

    case types.UPDATE_MEMBERSHIP: {
      const {userId: id, update} = payload

      const newState = [...state]
      const index = findIndex(newState, {id})
      if (index === -1) return state
      const user = newState[index]
      newState.splice(index, 1, {
        ...user,
        ...update
      })
      return newState
    }

    default:
      return state
  }
}
