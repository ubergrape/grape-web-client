import * as types from '../constants/actionTypes'

const initialState = {
  users: []
}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SET_USERS:
      return action.payload.users
    default:
      return state
  }
}
