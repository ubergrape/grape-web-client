import findIndex from 'lodash/array/findIndex'

import * as types from '../constants/actionTypes'

const initialState = {
  items: [],
  isLoading: false,
  channel: undefined
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_SIDEBAR_IS_LOADING:
    case types.REQUEST_PINNED_MESSAGES:
    case types.HANDLE_PINNED_MESSAGES:
    case types.ADD_PINNED_MESSAGE:
    case types.REMOVE_PINNED_MESSAGE:
      return {...state, ...action.payload}
    case types.SET_CHANNEL:
      // Don't reset the state if channel hasn't changed.
      if (state.channel && state.channel.id === action.payload.channel.id) {
        return state
      }
      return {...initialState, channel: action.payload.channel}
    case types.UPDATE_MESSAGE: {
      const message = action.payload

      // That message comes from a different channel.
      if (message.channelId !== state.channel.id) {
        return state
      }

      let items = [...state.items]
      const index = findIndex(items, {id: message.id})

      // Add a new message.
      if (index === -1) {
        items.push(message)
        items = items.sort((a, b) => (a.time > b.time ? -1 : 1))
      // Update a message.
      } else if (message.isPinned) {
        Object.assign(items[index], message)
      // Remove a message.
      } else {
        items.splice(index, 1)
      }

      return {...state, items}
    }
    default:
      return state
  }
}
