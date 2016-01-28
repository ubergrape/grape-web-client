import * as types from '../constants/actionTypes'

const initialState = {
  channel: {},
  show: false
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_USER:
    case types.SET_CHANNEL:
    case types.HIDE_CHANNEL_INFO:
    case types.SHOW_CHANNEL_INFO:
    case types.ADD_USER_TO_CURRENT_CHANNEL:
      return {...state, ...action.payload}
    case types.USER_LEFT_CHANNEL:
      let {channel} = state
      if (channel && channel.id === action.payload.channelId) {
        const users = channel.users.filter(user => user.id != action.payload.userId)
        channel = {...channel, users}
        return {...state, channel}
      }
      return state
    default:
      return state
  }
}
