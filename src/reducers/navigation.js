import * as types from '../constants/actionTypes'

const initialState = {
  foundChannels: [],
  searchChannels: '',
  searchingChannels: false,
}

export default function reduce(state = initialState, action) {
  const { payload } = action
  switch (action.type) {
    case types.HANDLE_FOUND_CHANNELS_FOR_NAV: {
      const { search, results } = payload
      if (search !== state.searchChannels) return state
      return {
        ...state,
        foundChannels: results,
        searchingChannels: false,
      }
    }
    case types.REQUEST_SEARCH_CHANNELS_FOR_NAV:
      return {
        ...state,
        searchChannels: payload,
        searchingChannels: true,
      }
    default:
      return state
  }
}
