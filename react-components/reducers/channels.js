import * as types from '../constants/actionTypes'
import findIndex from 'lodash/array/findIndex'

const initialState = []

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_CHANNELS:
      return [...action.payload]

    case types.SET_CHANNEL: {
      const {id, type} = action.payload.channel

      return state.reduce((newState, channel) => {
        if (channel.id === id && channel.type === type) {
          newState.push({...channel, current: true})
          return newState
        }
        if (channel.current) {
          newState.push({...channel, current: false})
          return newState
        }
        newState.push(channel)
        return newState
      }, [])
    }

    case types.CREATE_NEW_CHANNEL:
      return [...state, action.payload]

    case types.ADD_USER_TO_CHANNEL: {
      const {user, channelId: id, isCurrentUser} = action.payload
      if (!user) return state

      const newState = [...state]
      const index = findIndex(newState, {id})
      const channel = newState[index]
      newState.splice(index, 1, {
        ...channel,
        users: [...channel.users, user.id],
        joined: isCurrentUser ? true : channel.joined
      })
      return newState
    }

    case types.REMOVE_USER_FROM_CHANNEL: {
      const {user, channelId: id, isCurrentUser} = action.payload

      const newState = [...state]
      const index = findIndex(newState, {id})
      const channel = newState[index]
      newState.splice(index, 1, {
        ...channel,
        users: channel.users.filter(_id => _id !== user.id),
        joined: isCurrentUser ? false : channel.joined
      })
      return newState
    }

    case types.UPDATE_CHANNEL: {
      const {id, type} = action.payload

      const newState = [...state]
      const index = findIndex(newState, {id, type})
      const channel = newState[index]
      newState.splice(index, 1, {
        ...channel,
        ...action.payload
      })
      return newState
    }

    case types.REMOVE_ROOM: {
      return state.filter(({type, id}) => !(type === 'room' && id === action.payload))
    }

    case types.ADD_NEW_MESSAGE: {
      const {channel: id, time} = action.payload.message
      const {isCurrentUser, mentionsCount} = action.payload

      const newState = [...state]
      const index = findIndex(newState, {id})
      const channel = newState[index]
      const timestamp = time.getTime()
      newState.splice(index, 1, {
        ...channel,
        latestMessageTime: timestamp,
        firstMessageTime: channel.firstMessageTime || timestamp,
        mentioned: mentionsCount || channel.mentioned,
        unread: isCurrentUser ? 0 : channel.unread + 1
      })
      return newState
    }

    case types.MARK_CHANNEL_AS_READ: {
      const {channelId: id, isCurrentUser} = action.payload
      if (!isCurrentUser) return state

      const newState = [...state]
      const index = findIndex(newState, {id})
      const channel = newState[index]
      newState.splice(index, 1, {
        ...channel,
        mentioned: 0,
        unread: 0
      })
      return newState
    }

    case types.CHANGE_FAVOURITED: {
      const newState = [...state]
      action.payload.forEach(({channelId: id, favourited}) => {
        const index = findIndex(newState, {id})
        const channel = newState[index]
        newState.splice(index, 1, {
          ...channel,
          favourited
        })
      })
      return newState
    }

    default:
      return state
  }
}
