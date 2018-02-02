import * as types from '../constants/actionTypes'

const initialState = {
  channelsToMention: [],
  foundChannels: []
}

export default function reduce(state = initialState, action) {
  const {payload} = action
  switch (action.type) {
    case types.HANDLE_CHANNELS_TO_MENTION:
      return {...state, channelsToMention: payload}
    case types.REQUEST_SEARCH_CHANNELS_TO_MENTION: return {...state}
    case types.HANDLE_FOUND_CHANNELS:
      return {...state, foundChannels: payload}
    case types.REQUEST_SEARCH_FOUND_CHANNELS: return {...state}
    default:
      return state
  }
}
