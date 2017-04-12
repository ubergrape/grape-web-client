import * as types from '../constants/actionTypes'

const initialState = {
  messages: [],
  isLoading: true,
  currentChannelOnly: false,
  newMessagesAmount: 0
}

export default function reduce(state = initialState, action) {
  const {payload} = action

  switch (action.type) {
    case types.REQUEST_LABELS:
      return {
        ...state,
        isLoading: true
      }
    case types.HANDLE_LOADED_LABELS:
      return {
        ...state,
        isLoading: false,
        newMessagesAmount: 0,
        messages: payload
      }
    case types.HANDLE_MORE_LOADED_LABELS:
      return {
        ...state,
        isLoading: false,
        messages: [...state.messages, ...payload]
      }
    case types.HIDE_SIDEBAR:
      return initialState
    case types.TOGGLE_SEARCH_IN_CHANNEL_ONLY:
      return {
        ...state,
        currentChannelOnly: !state.currentChannelOnly,
        messages: initialState.messages,
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
    case types.HANDLE_MESSAGE_LABELED:
      // User doesn't need to see a new message from a different channel
      // when this option is turned on.
      if (state.currentChannelOnly && payload.channel !== state.channel.id) {
        return state
      }

      return {
        ...state,
        newMessagesAmount: state.newMessagesAmount + 1
      }
    default:
      return state
  }
}
