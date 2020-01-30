import findIndex from 'lodash/findIndex'
import find from 'lodash/find'
import * as types from '../constants/actionTypes'

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
      const { id, type } = action.payload.channel
      return state.reduce((newState, channel) => {
        if (channel.id === id && channel.type === type) {
          const newChannel = {
            ...Object.assign({}, channel, action.payload.channel),
            current: true,
          }
          // In case of empty PM we're adding it to the navigation
          // with the current timestamp to sort later by it's value.
          // It is not saved in the backend and lives only
          // for the current session lifetime.
          if (type === 'pm' && !channel.lastMessageTime) {
            newChannel.temporaryInNavigation = Date.now()
          }
          newState.push(newChannel)
          return newState
        }
        if (channel.current) {
          newState.push({
            ...channel,
            current: false,
          })
          return newState
        }
        newState.push(channel)
        return newState
      }, [])
    }

    case types.ADD_CALL: {
      const {
        channel: { id },
        call,
      } = action.payload

      const newState = [...state]
      const index = findIndex(newState, { id })

      if (index === -1) return state

      const channel = newState[index]

      newState.splice(index, 1, {
        ...channel,
        calls: [
          {
            ...call,
          },
        ],
      })

      return newState
    }

    case types.REMOVE_CALL: {
      const id = action.payload

      const newState = [...state]
      const index = findIndex(newState, { id })

      if (index === -1) return state

      const channel = newState[index]

      newState.splice(index, 1, {
        ...channel,
        calls: [],
      })

      return newState
    }

    case types.ADD_CHANNEL: {
      const channel = action.payload
      if (find(state, { id: channel.id })) {
        return state
      }

      return [...state, channel]
    }

    case types.ADD_USER_TO_CHANNEL: {
      const {
        user,
        channel: { id },
      } = action.payload

      if (!user) return state

      const newState = [...state]
      const index = findIndex(newState, { id })

      if (index === -1) return state

      const channel = newState[index]

      newState.splice(index, 1, channel)
      return newState
    }

    case types.REMOVE_USER_FROM_CHANNEL: {
      if (!action.payload.isCurrentUser) return state
      return state.filter(({ id }) => !(id === action.payload.channelId))
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
        ({ type, id }) => !(type === 'room' && id === action.payload.channelId),
      )
    }

    case types.UPDATE_CHANNEL_STATS: {
      const { isCurrentUser, mentionsCount, message } = action.payload
      const { channelId: id } = message

      const newState = [...state]
      const index = findIndex(newState, { id })
      if (index === -1) return state
      const channel = newState[index]
      const mentions = channel.mentions || 0
      newState.splice(index, 1, {
        ...channel,
        lastMessageTime: message.time,
        mentions: mentions + mentionsCount || channel.mentions,
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
        mentions: 0,
        unread: 0,
      })
      return newState
    }

    case types.UPDATE_CHANNEL_UNREAD_COUNTER: {
      const { id, unread, lastMessage } = action.payload
      const index = findIndex(state, { id })
      if (index === -1) return state
      const newState = [...state]

      newState.splice(index, 1, {
        ...state[index],
        unread,
        lastMessageTime: lastMessage ? lastMessage.time : null,
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

    case types.ADD_USER_TO_ORG: {
      if (findIndex(state, { id: action.payload.id }) === -1) {
        return [...state, action.payload]
      }
      return state
    }

    case types.CHANGE_USER_STATUS: {
      const { id, status } = action.payload

      const newState = [...state]
      const index = findIndex(newState, channel => {
        if (channel.partner) {
          return channel.partner.id === id
        }
        return channel.id === id
      })
      if (index === -1) return state
      const channel = newState[index]
      newState.splice(index, 1, {
        ...channel,
        partner: {
          ...channel.partner,
          status,
        },
      })
      return newState
    }

    case types.UPDATE_USER: {
      const newState = [...state]
      const index = findIndex(newState, { partner: { id: action.payload.id } })
      if (index === -1) return state
      const channel = newState[index]
      newState.splice(index, 1, {
        ...channel,
        partner: {
          ...action.payload,
          status: channel.partner.status,
        },
      })
      return newState
    }

    case types.UPDATE_MEMBERSHIP: {
      const { userId: id, update } = action.payload

      const newState = [...state]
      const index = findIndex(newState, { id })
      if (index === -1) return state
      const channel = newState[index]
      newState.splice(index, 1, {
        ...channel,
        ...update,
      })
      return newState
    }

    default:
      return state
  }
}
