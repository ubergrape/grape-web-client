import * as types from '../constants/actionTypes'

const initialState = {
  messages: [],
  labelConfigs: [],
  isLoading: true,
  currentChannelOnly: false,
  newMessagesAmount: 0,
  filter: 'all'
}

export default function reduce(state = initialState, action) {
  const {payload} = action

  switch (action.type) {
    case types.REQUEST_LABELED_MESSAGES:
      return {
        ...state,
        isLoading: true
      }
    case types.HANDLE_LOADED_LABELED_MESSAGES:
      return {
        ...state,
        isLoading: false,
        newMessagesAmount: 0,
        messages: payload.messages,
        labelConfigs: payload.labelConfigs
      }
    case types.HANDLE_MORE_LOADED_LABELED_MESSAGES:
      return {
        ...state,
        isLoading: false,
        messages: [...state.messages, ...payload.messages],
        labelConfigs: payload.labelConfigs
      }
    case types.HIDE_SIDEBAR:
      return initialState
    case types.TOGGLE_SEARCH_IN_CHANNEL_ONLY:
      return {
        ...state,
        currentChannelOnly: !state.currentChannelOnly,
        messages: initialState.messages,
        labelConfigs: initialState.labelConfigs,
        isLoading: true
      }
    case types.SET_CHANNEL: {
      if (state.channel && payload.channel.id === state.channel.id) {
        return state
      }

      const newState = {
        ...state,
        channel: payload.channel
      }

      if (state.currentChannelOnly) {
        newState.isLoading = true
        newState.messages = []
      }

      return newState
    }
    case types.SELECT_LABELED_MESSAGE_FILTER:
      return {
        ...state,
        filter: payload
      }
    case types.UPDATE_MESSAGE: {
      const messages = state.messages.map(message => (
        message.id === payload.id ? payload : message
      ))

      return {...state, messages}
    }
    case types.HANDLE_MESSAGE_LABELED: {
      const {filter, currentChannelOnly, channel, newMessagesAmount} = state
      // Ignore messages which don't pass the filter.
      const isFiltered = filter !== 'all' && payload.labels.indexOf(filter) === -1
      // User doesn't need to see a new message from a different channel
      // when this option is turned on.
      const isWrongChannel = currentChannelOnly && payload.channel !== channel.id

      if (isFiltered || isWrongChannel) return state

      return {
        ...state,
        newMessagesAmount: newMessagesAmount + 1
      }
    }
    default:
      return state
  }
}
