import * as types from '../constants/actionTypes'

const initialState = {
  amount: 0,
  channelName: null
}

let userId

const channels = new class Channels {
  static defaultChannel = {
    hasUnread: false,
    joined: false
  }

  constructor() {
    this.map = {}
  }

  create(_channels) {
    this.map = _channels.reduce((map, channel) => {
      map[channel.id] = {
        joined: channel.joined,
        hasUnread: channel.unread > 0
      }
      return map
    }, {})
  }

  /**
   * Get channel options, ensure a default channel options object.
   */
  get(id) {
    if (!this.map[id]) {
      this.map[id] = {
        hasUnread: false,
        joined: false
      }
    }
    return this.map[id]
  }

  join(id) {
    this.get(id).joined = true
  }

  leave(id) {
    this.get(id).joined = false
  }

  setUnread(id) {
    this.get(id).hasUnread = true
  }

  setRead(id) {
    this.get(id).hasUnread = false
  }

  /**
   * Calculate amount of hasUnread channels.
   */
  calcUnread() {
    return Object.keys(this.map).reduce((amount, channelId) => {
      const channel = this.map[channelId]
      return channel.joined && channel.hasUnread ? amount + 1 : amount
    }, 0)
  }
}

/**
 * Maintains counter of channels which has at least 1 hasUnread message.
 */
export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.READ_CHANNEL:
      // Only mark as read channel from hasUnread if reader is the logged in user.
      if (userId === action.payload.userId) {
        channels.setRead(action.payload.channelId)
        return {...state, amount: channels.calcUnread()}
      }
      return state
    case types.HANDLE_NEW_MESSAGE:
      channels.setUnread(action.payload.message.channel)
      return {...state, amount: channels.calcUnread()}
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
      channels.create(action.payload.channels)
      return {
        ...state,
        amount: channels.calcUnread()
      }
    case types.USER_JOINED_CHANNEL:
      // Only if current user has joined the channel.
      if (userId === action.payload.userId) {
        channels.join(action.payload.channelId)
        return {...state, amount: channels.calcUnread()}
      }
      return state
    case types.USER_LEFT_CHANNEL:
      // Only if current user has left the channel.
      if (userId === action.payload.userId) {
        channels.leave(action.payload.channelId)
        return {...state, amount: channels.calcUnread()}
      }
      return state
    default:
      return state
  }
}
