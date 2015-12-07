import * as types from '../constants/actionTypes'

const initialState = {
  show: false
}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SET_CHANNEL:
      if (action.payload.channel.type === 'pm') {
        return {...state, ...action.payload.channel.users[0]}
      }
      return state
    case types.HIDE_USER_PROFILE:
    case types.SHOW_USER_PROFILE:
      return {...state, ...action.payload}
    default:
      return state
  }
}
