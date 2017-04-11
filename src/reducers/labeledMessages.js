import * as types from '../constants/actionTypes'

const initialState = {
  messages: [],
  isLoading: true,
  currentChannelOnly: false
}

export default function reduce(state = initialState, action) {
  const {payload} = action

  switch (action.type) {
    case types.LOAD_LABELS:
      return {
        ...state,
        isLoading: true
      }
    case types.HANDLE_LOADED_LABELS:
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
    case types.SET_CHANNEL:
      if (payload.channel !== state.channel) {
        return {
          ...state,
          messages: []
        }
      }
      return state
    default:
      return state
  }
}
