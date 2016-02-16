import * as types from '../constants/actionTypes'

const initialState = []

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_CHANNELS:
      return [...action.payload]

    case types.SET_CHANNEL: {
      const {id, type} = action.payload.channel
      return state.reduce((newState, channel) => {
        if (channel.current) {
          newState.push({...channel, current: false})
          return newState
        }
        if (channel.id === id && channel.type === type) {
          newState.push({...channel, current: true})
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

      return state.reduce((newState, channel) => {
        if (channel.id === id) {
          newState.push({...channel, users: [...channel.users, user]})
          return newState
        }

        newState.push(channel)
        return newState
      }, [])
    }

    case types.REMOVE_USER_FROM_CHANNEL: {
      const {userId, channelId} = action.payload

      return state.reduce((newState, channel) => {
        if (channel.id === channelId) {
          const users = channel.users.reduce((newUsers, user) => {
            if (user.id !== userId) newUsers.push(user)
            return newUsers
          }, [])
          newState.push({...channel, users})
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
