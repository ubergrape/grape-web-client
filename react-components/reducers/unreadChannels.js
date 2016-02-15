import * as types from '../constants/actionTypes'

const initialState = {
  amount: 0,
  channelName: null
}

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
  const {payload} = action
  switch (action.type) {
    case types.READ_CHANNEL:
      if (payload.isCurrentUser) {
        channels.setRead(payload.channelId)
        return {...state, amount: channels.calcUnread()}
      }
      return state
    case types.HANDLE_NEW_MESSAGE:
      channels.setUnread(payload.message.channel)
      return {...state, amount: channels.calcUnread()}
    case types.SET_CHANNEL:
      return (() => {
        const {channel} = payload
        return {
          ...state,
          channelName: channel.name || channel.users[0].displayName
        }
      }())
    case types.SET_CHANNELS:
      channels.create(payload)
      return {
        ...state,
        amount: channels.calcUnread()
      }
    case types.USER_JOINED_CHANNEL:
      if (payload.isCurrentUser) {
        channels.join(payload.channelId)
        return {...state, amount: channels.calcUnread()}
      }
      return state
    case types.USER_LEFT_CHANNEL:
      if (payload.isCurrentUser) {
        channels.leave(payload.channelId)
        return {...state, amount: channels.calcUnread()}
      }
      return state
    default:
      return state
  }
}
