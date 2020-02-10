import { find, merge } from 'lodash'

import * as types from '../constants/actionTypes'

const initialState = {
  messages: [],
  labelsConfig: [],
  isLoading: false,
  options: {
    currentChannelOnly: {
      show: true,
      status: false,
    },
  },
  newMessagesAmount: 0,
  filter: 'all',
}

export default function reduce(state = initialState, action) {
  const { payload } = action

  switch (action.type) {
    case types.HIDE_SIDEBAR:
      return initialState
    case types.SET_SIDEBAR_OPTIONS:
      return { ...state, options: merge({}, state.options, action.payload) }
    case types.REQUEST_LABELED_MESSAGES:
      return {
        ...state,
        isLoading: true,
      }
    case types.HANDLE_LOADED_LABELED_MESSAGES:
      return {
        ...state,
        isLoading: false,
        newMessagesAmount: 0,
        messages: payload.messages,
        labelsConfig: payload.labelsConfig,
      }
    case types.HANDLE_MORE_LOADED_LABELED_MESSAGES:
      return {
        ...state,
        isLoading: false,
        messages: [...state.messages, ...payload.messages],
        labelsConfig: payload.labelsConfig,
      }
    case types.TOGGLE_SEARCH_IN_CHANNEL_ONLY: {
      const options = merge({}, state.options)
      options.currentChannelOnly.status = !options.currentChannelOnly.status
      return {
        ...state,
        options,
        messages: initialState.messages,
        labelsConfig: initialState.labelsConfig,
        isLoading: true,
      }
    }
    case types.SET_CHANNEL: {
      if (payload.currentChannel.id === payload.channel.id) {
        return state
      }

      const newState = {
        ...state,
      }

      if (state.options.currentChannelOnly.status) {
        newState.isLoading = true
        newState.messages = []
      }

      return newState
    }
    case types.SELECT_LABELED_MESSAGE_FILTER:
      return {
        ...state,
        filter: payload,
      }
    case types.UPDATE_MESSAGE: {
      const messages = state.messages.map(message =>
        message.id === payload.id ? payload : message,
      )

      return { ...state, messages }
    }
    case types.REMOVE_MESSAGE: {
      const messages = state.messages.filter(message => message.id !== payload)

      return { ...state, messages }
    }
    case types.HANDLE_MESSAGE_LABELED: {
      const { filter, options, channel, newMessagesAmount, messages } = state

      // Ignore messages which don't pass the filter.
      const isFiltered =
        filter !== 'all' && payload.labels.indexOf(filter) === -1
      // User doesn't need to see a new message from a different channel
      // when this option is turned on.
      const isWrongChannel =
        options.currentChannelOnly.status && payload.channel !== channel.id

      if (isFiltered || isWrongChannel) return state

      const hasMessage = Boolean(find(messages, { id: payload.id }))

      if (hasMessage) return state

      return {
        ...state,
        newMessagesAmount: newMessagesAmount + 1,
      }
    }
    default:
      return state
  }
}
