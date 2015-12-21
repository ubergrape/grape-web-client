import * as types from '../constants/actionTypes'

const initialState = {
  show: false
}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SET_USER:
    case types.SET_CHANNEL:
    case types.HIDE_CHANNEL_INFO:
    case types.SHOW_CHANNEL_INFO:
    case types.ADDED_USER_TO_CURRENT_CHANNEL:
    case types.USER_LEFT_CURRENT_CHANNEL:
      return {...state, ...action.payload}
    default:
      return state
  }
}
