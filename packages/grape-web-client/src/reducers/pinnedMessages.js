import findIndex from 'lodash/findIndex'

import * as types from '../constants/actionTypes'

const initialState = {
  items: [],
  isLoading: false,
}

export default function reduce(state = initialState, action) {
  const { payload } = action
  switch (action.type) {
    case types.SET_SIDEBAR_IS_LOADING:
    case types.REQUEST_PINNED_MESSAGES:
    case types.HANDLE_PINNED_MESSAGES:
      return { ...state, ...action.payload }
    case types.REMOVE_MESSAGE:
      return {
        ...state,
        items: state.items.filter(({ id }) => id !== action.payload),
      }
    case types.SET_CHANNEL:
      // Don't reset the state if channel hasn't changed.
      if (payload.currentChannel.id === payload.channel.id) {
        return state
      }
      return initialState
    case types.UPDATE_MESSAGE: {
      if (
        // That message comes from a different channel.
        payload.channelId !== payload.channel.id ||
        // We don't support attachments currently.
        payload.attachments.length
      ) {
        return state
      }

      const index = findIndex(state.items, { id: payload.id })

      if (index === -1 && !payload.isPinned) return state

      let items = [...state.items]

      // Add a new message, which has been just pinned.
      if (index === -1) {
        items.push(payload)
        items = items.sort((a, b) => (a.time > b.time ? -1 : 1))
        // Update a message.
      } else if (payload.isPinned) {
        items[index] = { ...items[index], ...payload }
        // Remove a message.
      } else {
        items.splice(index, 1)
      }

      return { ...state, items }
    }
    default:
      return state
  }
}
