import * as types from '../constants/actionTypes'

const initialState = {
  amount: 0,
  channelName: null
}

let channelsMap = {}
let userId


/**
 * Calculate amount of hasUnread channels.
 */
function calc(map) {
  return Object.keys(map).reduce((amount, channelId) => {
    const channel = map[channelId]
    return channel.joined && channel.hasUnread ? amount + 1 : amount
  }, 0)
}

/**
 * Maintains counter of channels which has at least 1 hasUnread message.
 */
export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.READ_CHANNEL:
      // Only mark as read channel from hasUnread if reader is the logged in user.
      if (userId === action.payload.userId) {
        channelsMap[action.payload.channelId].hasUnread = false
        return {...state, amount: calc(channelsMap)}
      }
      return state
    case types.HANDLE_NEW_MESSAGE:
      return (() => {
        const channel = channelsMap[action.payload.message.channel]
        channel.hasUnread = true
        return channel.joined ? {...state, amount: calc(channelsMap)} : state
      }())
    case types.SET_USER:
      userId = action.payload.user.id
      return state
    case types.SET_CHANNEL:
      return (() => {
        const {channel} = action.payload
        return {
          ...state,
          channelName: channel.name || channel.users[0].displayName
        }
      }())
    case types.SET_CHANNELS:
      channelsMap = action.payload.channels.reduce((map, _channel) => {
        map[_channel.id] = {
          joined: _channel.joined,
          hasUnread: _channel.unread > 0
        }
        return map
      }, {})

      return {
        ...state,
        amount: calc(channelsMap)
      }
    case types.USER_JOINED_CHANNEL:
      // Only if logged in user has left the channel.
      if (userId === action.payload.userId) {
        channelsMap[action.payload.channelId].joined = true
        return {...state, amount: calc(channelsMap)}
      }
      return state
    case types.USER_LEFT_CHANNEL:
      // Only if logged in user has left the channel.
      if (userId === action.payload.userId) {
        channelsMap[action.payload.channelId].joined = false
        return {...state, amount: calc(channelsMap)}
      }
      return state
    default:
      return state
  }
}
