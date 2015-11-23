import * as types from '../constants/actionTypes'

const initialState = {
  channels: {}
}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SET_TYPING_USERS:
    case types.SET_CHANNEL:
      return {...state, ...action.payload}
    default:
      return state
  }
}
