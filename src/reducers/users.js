import findIndex from 'lodash/findIndex'

import * as types from '../constants/actionTypes'

const initialState = []

export default function reduce(state = initialState, action) {
  const { payload } = action

  switch (action.type) {
    case types.SET_USERS:
      // please read comment for SET_CHANNELS, same goes here
      return [
        ...state.filter(o => !action.payload.find(o2 => o.id === o2.id)),
        ...action.payload,
      ]

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
      const { id, status } = payload

      const newState = [...state]
      const index = findIndex(newState, user => {
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
          status,
        },
      })
      return newState
    }

    case types.UPDATE_USER: {
      const newState = [...state]
      const index = findIndex(newState, { partner: { id: payload.id } })
      if (index === -1) return state
      const user = newState[index]
      newState.splice(index, 1, {
        ...user,
        partner: {
          ...payload,
          status: user.partner.status,
        },
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
        ...update,
      })
      return newState
    }

    default:
      return state
  }
}
