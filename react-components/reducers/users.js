import * as types from '../constants/actionTypes'

const initialState = []

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_USERS:
      return [...action.payload]

    case types.SET_USER: {
      const {id} = action.payload.user
      return state.reduce((newState, user) => {
        if (user.id === id) {
          newState.push({...user, current: true})
          return newState
        }
        if (user.current) {
          newState.push({...user, current: true})
          return newState
        }
        newState.push(user)
        return newState
      }, [])
    }

    case types.NEW_USER_IN_ORG:
      return [...state, action.payload]

    case types.USER_LEFT_ORG: {
      return state.reduce((newState, user) => {
        if (user.id === action.payload) {
          newState.push({...user, active: false})
          return newState
        }
        newState.push(user)
        return newState
      }, [])
    }

    case types.CHANGE_USER_STATUS: {
      const {userId, status} = action.payload
      return state.reduce((newState, user) => {
        if (user.id === userId) {
          newState.push({...user, status})
          return newState
        }
        newState.push(user)
        return newState
      }, [])
    }

    case types.UPDATE_USER: {
      const {payload} = action
      return state.reduce((newState, user) => {
        if (user.id === payload.id) {
          const avatar = payload.avatar || user.avatar
          newState.push({...user, ...payload, avatar})
          return newState
        }
        newState.push(user)
        return newState
      }, [])
    }

    default:
      return state
  }
}
