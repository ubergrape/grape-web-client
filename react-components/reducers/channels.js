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
      const {user, channelId: id} = action.payload
      if (!user) return state

      return state.reduce((newState, channel) => {
        if (channel.id === id) {
          newState.push({...channel, users: [...channel.users, user.id]})
          return newState
        }

        newState.push(channel)
        return newState
      }, [])
    }

    case types.REMOVE_USER_FROM_CHANNEL: {
      const {user, channelId} = action.payload

      return state.reduce((newState, channel) => {
        if (channel.id === channelId) {
          const users = channel.users.reduce((newUsers, id) => {
            if (id !== user.id) newUsers.push(id)
            return newUsers
          }, [])
          newState.push({...channel, users})
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

      return state.reduce((newState, channel) => {
        if (channel.id === channelId) {
          const timestamp = time.getTime()
          newState.push({
            ...channel,
            latestMessageTime: timestamp,
            firstMessageTime: channel.firstMessageTime || timestamp
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
