import * as types from '../constants/actionTypes'

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

    case types.NEW_CHANNEL:
      return [...state, action.payload]

    case types.ADD_USER_TO_CHANNEL: {
      const {user, channelId: id, isCurrentUser} = action.payload
      if (!user) return state

      return state.reduce((newState, channel) => {
        if (channel.id === id) {
          newState.push({
            ...channel,
            users: [...channel.users, user.id],
            joined: isCurrentUser ? true : channel.joined
          })
          return newState
        }

        newState.push(channel)
        return newState
      }, [])
    }

    case types.REMOVE_USER_FROM_CHANNEL: {
      const {user, channelId, isCurrentUser} = action.payload

      return state.reduce((newState, channel) => {
        if (channel.id === channelId) {
          newState.push({
            ...channel,
            users: channel.users.filter(id => id !== user.id),
            joined: isCurrentUser ? false : channel.joined
          })
          return newState
        }
        newState.push(channel)
        return newState
      }, [])
    }

    case types.UPDATE_CHANNEL: {
      const {id, type} = action.payload

      return state.reduce((newState, channel) => {
        if (channel.id === id && channel.type === type) {
          newState.push({...channel, ...action.payload})
          return newState
        }
        newState.push(channel)
        return newState
      }, [])
    }

    case types.REMOVE_ROOM: {
      return state.reduce((newState, channel) => {
        if (channel.id === action.payload && channel.type === 'room') {
          return newState
        }
        newState.push(channel)
        return newState
      }, [])
    }

    case types.NEW_MESSAGE: {
      const {channel: channelId, time} = action.payload.message
      const {isCurrentUser, mentionsCount} = action.payload

      return state.reduce((newState, channel) => {
        if (channel.id === channelId) {
          const timestamp = time.getTime()
          newState.push({
            ...channel,
            latestMessageTime: timestamp,
            firstMessageTime: channel.firstMessageTime || timestamp,
            mentioned: mentionsCount || channel.mentioned,
            unread: isCurrentUser ? 0 : channel.unread + 1
          })
          return newState
        }
        newState.push(channel)
        return newState
      }, [])
    }

    case types.READ_CHANNEL: {
      const {channelId, isCurrentUser} = action.payload
      if (!isCurrentUser) return state

      return state.reduce((newState, channel) => {
        if (channel.id === channelId) {
          newState.push({
            ...channel,
            mentioned: 0,
            unread: 0
          })
          return newState
        }
        newState.push(channel)
        return newState
      }, [])
    }

    default:
      return state
  }
}
