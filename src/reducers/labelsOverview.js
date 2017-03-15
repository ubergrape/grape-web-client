import * as types from '../constants/actionTypes'

const initialState = {
  labels: [],
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
        labels: [...state.labels, ...payload]
      }
    case types.HIDE_SIDEBAR:
      return initialState
    case types.TOGGLE_SEARCH_IN_CHANNEL_ONLY:
      return {
        ...state,
        currentChannelOnly: !state.currentChannelOnly,
        labels: initialState.labels,
        isLoading: true
      }
    default:
      return state
  }
}
