import * as types from '../constants/actionTypes'
import findIndex from 'lodash/array/findIndex'

const initialState = []

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_USERS:
      return [...action.payload]

    case types.SET_USER: {
      const {id} = action.payload
      return state.reduce((newState, user) => {
        if (user.id === id) {
          newState.push({...user, current: true})
          return newState
        }
        if (user.current) {
          newState.push({...user, current: false})
          return newState
        }
        newState.push(user)
        return newState
      }, [])
    }

    case types.ADD_USER_TO_ORG:
      return [...state, action.payload]

    case types.REMOVE_USER_FROM_ORG: {
      const newState = [...state]
      const index = findIndex(newState, {id: action.payload})
      if (index === -1) return state
      const user = newState[index]
      newState.splice(index, 1, {
        ...user,
        active: false
      })
      return newState
    }

    case types.CHANGE_USER_STATUS: {
      const {userId: id, status} = action.payload

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
      const {payload} = action

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
      const {userId: id, update} = action.payload

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
