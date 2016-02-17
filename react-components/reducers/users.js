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


    default:
      return state
  }
}
