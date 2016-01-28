import * as types from '../constants/actionTypes'

const initialState = {
  channelsMap: {},
  amount: 0,
  userId: null,
  channelName: null
}

/**
 * Calculate amount of hasUnread channels.
 */
function calc(channelsMap) {
  return Object.keys(channelsMap).reduce((amount, channelId) => {
    const channel = channelsMap[channelId]
    return channel.joined && channel.hasUnread ? amount + 1 : amount
  }, 0)
}

/**
 * Maintains counter of channels which has at least 1 hasUnread message.
 */
export default function reduce(state = initialState, action) {
  let {channelsMap} = state

  switch (action.type) {
    case types.READ_CHANNEL:
      // Only mark as read channel from hasUnread if reader is the logged in user.
      if (state.userId === action.payload.userId) {
        channelsMap[action.payload.channelId].hasUnread = false
        return {...state, amount: calc(channelsMap), channelsMap}
      }
      return state
    case types.HANDLE_NEW_MESSAGE:
      const channelId = action.payload.message.channel
      channelsMap[channelId].hasUnread = true
      if (channelsMap[channelId].joined) {
        return {...state, amount: calc(channelsMap), channelsMap}
      }
      return state
    case types.SET_USER:
      return {...state, userId: action.payload.user.id}
    case types.SET_CHANNEL:
      const {channel} = action.payload
      return {
        ...state,
        channelName: channel.name || channel.users[0].displayName
      }
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
        channelsMap,
        amount: calc(channelsMap)
      }
    case types.USER_JOINED_CHANNEL:
      channelsMap[action.payload.channelId].joined = true
      return {...state, channelsMap, amount: calc(channelsMap)}
    case types.USER_LEFT_CHANNEL:
      // Only if logged in user has left the channel.
      if (state.userId === action.payload.userId) {
        channelsMap[action.payload.channelId].joined = false
        return {...state, channelsMap, amount: calc(channelsMap)}
      }
      return state
    default:
      return state
  }
}
