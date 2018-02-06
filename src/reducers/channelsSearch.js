import * as types from '../constants/actionTypes'

const initialState = {
  channelsToMention: [],
  foundChannels: [],
  searchMention: '',
  searchChannels: '',
  searchingChannels: false,
  focusedChannel: {}
}

export default function reduce(state = initialState, action) {
  const {payload} = action
  switch (action.type) {
    case types.HANDLE_CHANNELS_TO_MENTION: {
      const {search, results} = payload
      if (search !== state.searchMention) return state
      return {...state, channelsToMention: results}
    }
    case types.REQUEST_SEARCH_CHANNELS_TO_MENTION: {
      return {...state, searchMention: payload}
    }
    case types.HANDLE_FOUND_CHANNELS: {
      const {search, results} = payload
      if (search !== state.searchChannels) return state
      return {
        ...state,
        foundChannels: results,
        focusedChannel: results[0] || {},
        searchingChannels: false
      }
    }
    case types.REQUEST_SEARCH_FOUND_CHANNELS:
      return {
        ...state,
        searchChannels: payload,
        searchingChannels: true
      }
    case types.SET_FOCUSED_CHANNEL: {
      return {
        ...state,
        focusedChannel: payload
      }
    }
    default:
      return state
  }
}
