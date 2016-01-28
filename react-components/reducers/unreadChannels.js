import size from 'lodash/collection/size'
import * as types from '../constants/actionTypes'

const initialState = {
  channels: {},
  amount: 0,
  userId: null,
  channelName: null
}

/**
 * Maintains counter of channels which has at least 1 unread message.
 */
export default function reduce(state = initialState, action) {
  let {channels} = state
  switch (action.type) {
    case types.READ_MESSAGE:
      // Only delete channel from unread if reader is the own user.
      if (state.userId === action.payload.userId) {
        delete channels[action.payload.channelId]
        return {...state, amount: size(channels), channels}
      }
      return state
    case types.HANDLE_NEW_MESSAGE:
      channels[action.payload.message.channel] = true
      return {...state, amount: size(state.channels), channels}
    case types.SET_USER:
      return {...state, userId: action.payload.user.id}
    case types.SET_CHANNEL:
      const {channel} = action.payload
      return {
        ...state,
        channelName: channel.name || channel.users[0].displayName
      }
    case types.SET_CHANNELS:
      channels = action.payload.channels.reduce((map, _channel) => {
        if (_channel.unread) map[_channel.id] = true
        return map
      }, {})
      return {...state, channels, amount: size(channels)}
    default:
      return state
  }
}
