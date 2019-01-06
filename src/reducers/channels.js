import findIndex from 'lodash/findIndex'
import find from 'lodash/find'
import * as types from '../constants/actionTypes'
import conf from '../conf'

const initialState = []

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_CHANNELS:
      // SET_CHANNELS is triggered in two places: initial route changing and
      // initial loading (also can be multiple times per session, while
      // reconecting to websocket).
      // To prevent duplicates the channels should be merged properly.
      return [
        ...state.filter(o => !action.payload.find(o2 => o.id === o2.id)),
        ...action.payload,
      ]

    case types.SET_CHANNEL: {
      const {
        id,
        type,
        permissions,
        videoconferenceUrl,
      } = action.payload.channel

      return state.reduce((newState, channel) => {
        if (channel.id === id && channel.type === type) {
          const newChannel = {
            ...channel,
            permissions,
            videoconferenceUrl,
            current: true,
          }
          // In case of empty PM we're adding it to the navigation
          // with the current timestamp to sort later by it's value.
          // It is not saved in the backend and lives only
          // for the current session lifetime.
          if (type === 'pm' && !channel.lastMessage) {
            newChannel.temporaryInNavigation = Date.now()
          }
          newState.push(newChannel)
          return newState
        }
        if (channel.current) {
          newState.push({ ...channel, current: false, videoconferenceUrl })
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

    case types.REMOVE_USER_FROM_CHANNEL: {
      const { channelId, userId } = action.payload
      const index = findIndex(state, { id: channelId })
      if (index === -1) return state
      const newState = [...state]
      const channel = state[index]
      newState.splice(index, 1, {
        ...channel,
        joined: conf.user.id !== userId,
      })
      return newState
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
        lastMessage: {
          ...channel.lastMessage,
          time: timestamp,
        },
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

    case types.UPDATE_CHANNEL_UNREAD_COUNTER: {
      const { id, unread, time } = action.payload
      const index = findIndex(state, { id })
      if (index === -1) return state
      const newState = [...state]
      newState.splice(index, 1, {
        ...state[index],
        unread,
        latestMessageTime: new Date(time).getTime(),
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

    case types.CHANGE_CHANNEL_STATUS: {
      const { userId: id, status } = action.payload

      const newState = [...state]
      const index = findIndex(newState, pmChannel => {
        if (pmChannel.partner) {
          return pmChannel.partner.id === id
        }
        return pmChannel.id === id
      })
      if (index === -1) return state
      const pmChannel = newState[index]
      newState.splice(index, 1, {
        ...pmChannel,
        partner: {
          ...pmChannel.partner,
          status,
        },
      })
      return newState
    }

    case types.UPDATE_PM_CHANNEL: {
      const newState = [...state]
      const index = findIndex(newState, { partner: { id: action.payload.id } })
      if (index === -1) return state
      const pmChannel = newState[index]
      newState.splice(index, 1, {
        ...pmChannel,
        partner: {
          ...action.payload,
          status: pmChannel.partner.status,
        },
      })
      return newState
    }

    case types.UPDATE_MEMBERSHIP: {
      const { userId: id, update } = action.payload

      const newState = [...state]
      const index = findIndex(newState, { id })
      if (index === -1) return state
      const pmChannel = newState[index]
      newState.splice(index, 1, {
        ...pmChannel,
        ...update,
      })
      return newState
    }

    default:
      return state
  }
}
