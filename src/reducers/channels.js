import findIndex from 'lodash/array/findIndex'
import includes from 'lodash/collection/includes'
import find from 'lodash/collection/find'
import * as types from '../constants/actionTypes'
import conf from '../conf'

const initialState = []

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_CHANNELS:
      return [
        ...state,
        ...action.payload.filter(o => !state.find(o2 => o.id === o2.id)),
      ]

    case types.SET_CHANNEL: {
      const { id, type } = action.payload.channel

      return state.reduce((newState, channel) => {
        if (channel.id === id && channel.type === type) {
          const newChannel = { ...channel, current: true }
          // In case of empty PM we're adding it to the navigation
          // with the current timestamp to sort later by it's value.
          // It is not saved in the backend and lives only
          // for the current session lifetime.
          if (type === 'pm' && !channel.firstMessageTime) {
            newChannel.temporaryInNavigation = Date.now()
          }
          newState.push(newChannel)
          return newState
        }
        if (channel.current) {
          newState.push({ ...channel, current: false })
          return newState
        }
        newState.push(channel)
        return newState
      }, [])
    }

    case types.ADD_CHANNEL: {
      const channel = action.payload
      if (find(state, { id: channel.id })) {
        return state
      }
      return [...state, channel]
    }

    case types.ADD_USER_TO_CHANNEL: {
      const { user, channelId: id, userId, isCurrentUser } = action.payload
      if (!user) return state

      const newState = [...state]
      const index = findIndex(newState, { id })
      if (index === -1) return state
      const channel = newState[index]
      const { users } = channel
      newState.splice(index, 1, {
        ...channel,
        // As a workaround of API bug,
        // we have to ensure that user isn't joined already.
        // https://github.com/ubergrape/chatgrape/issues/3804
        users: includes(users, userId) ? users : [...users, userId],
        joined: isCurrentUser ? true : channel.joined,
      })
      return newState
    }

    case types.REMOVE_USER_FROM_CHANNEL: {
      const { channelId, userId } = action.payload
      const index = findIndex(state, { id: channelId })
      if (index === -1) return state
      const channels = [...state]
      const channel = state[index]
      channels.splice(index, 1, {
        ...channel,
        users: channel.users.filter(id => id !== userId),
        joined: conf.user.id !== userId,
      })
      return channels
    }

    case types.UPDATE_CHANNEL: {
      const { id, type } = action.payload
      const newState = [...state]
      const index = findIndex(newState, { id, type })
      if (index === -1) return state
      const channel = newState[index]
      newState.splice(index, 1, {
        ...channel,
        ...action.payload,
      })
      return newState
    }

    case types.UPDATE_CHANNEL_PARTNER_INFO: {
      const { pm } = action.payload
      const newState = [...state]
      const index = findIndex(newState, { id: pm })
      if (index === -1) return state
      newState[index].partner = action.payload
      return newState
    }

    case types.REMOVE_ROOM: {
      return state.filter(
        ({ type, id }) => !(type === 'room' && id === action.payload),
      )
    }

    case types.UPDATE_CHANNEL_STATS: {
      const { channelId: id, time } = action.payload.message
      const { isCurrentUser, mentionsCount } = action.payload

      const newState = [...state]
      const index = findIndex(newState, { id })
      if (index === -1) return state
      const channel = newState[index]
      const timestamp = time.getTime()
      const mentioned = channel.mentioned || 0
      newState.splice(index, 1, {
        ...channel,
        latestMessageTime: timestamp,
        firstMessageTime: channel.firstMessageTime || timestamp,
        mentioned: mentioned + mentionsCount || channel.mentioned,
        unread: isCurrentUser ? 0 : channel.unread + 1,
      })
      return newState
    }

    case types.MARK_CHANNEL_AS_READ: {
      const { channelId: id, isCurrentUser } = action.payload
      if (!isCurrentUser) return state

      const newState = [...state]
      const index = findIndex(newState, { id })
      if (index === -1) return state
      const channel = newState[index]
      newState.splice(index, 1, {
        ...channel,
        mentioned: 0,
        unread: 0,
      })
      return newState
    }

    case types.CHANGE_FAVORITED: {
      const newState = [...state]
      action.payload.forEach(({ channelId: id, favorited }) => {
        const index = findIndex(newState, { id })
        if (index === -1) return
        const channel = newState[index]
        newState.splice(index, 1, {
          ...channel,
          favorited,
        })
      })
      return newState
    }

    case types.SET_UNSENT_MESSAGE: {
      const { id, msg } = action.payload
      const newState = [...state]
      const index = findIndex(newState, { id })
      if (index === -1) return state
      const channel = newState[index]
      newState.splice(index, 1, {
        ...channel,
        unsent: msg,
      })
      return newState
    }

    default:
      return state
  }
}
