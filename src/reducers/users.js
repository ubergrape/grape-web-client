import findIndex from 'lodash/array/findIndex'

import * as types from '../constants/actionTypes'

const initialState = []

export default function reduce(state = initialState, action) {
  const { payload } = action

  switch (action.type) {
    case types.SET_USERS:
      return [...state, ...payload]

    case types.ADD_USER_TO_ORG: {
      if (findIndex(state, { id: payload.id }) === -1) {
        return [...state, payload]
      }
      return state
    }
    case types.UPDATE_USER_PARTNER_INFO: {
      const newState = [...state]
      const index = findIndex(newState, { id: payload.pm })
      if (index === -1) return state
      newState[index].partner = payload
      return newState
    }

    case types.CHANGE_USER_STATUS: {
      const { userId: id, status } = payload

      const newState = [...state]
      const index = findIndex(newState, (user) => {
        if (user.partner) {
          return user.partner.id === id
        }
        return user.id === id
      })
      if (index === -1) return state
      const user = newState[index]
      newState.splice(index, 1, {
        ...user,
        partner: {
          ...user.partner,
          status
        }
      })
      return newState
    }

    case types.UPDATE_USER: {
      const newState = [...state]
      const index = findIndex(newState, { id: payload.id })
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
      const { userId: id, update } = payload

      const newState = [...state]
      const index = findIndex(newState, { id })
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
