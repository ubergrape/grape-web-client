import * as types from '../constants/actionTypes'

const initialState = {
  channelsToMention: [],
  search: ''
}

export default function reduce(state = initialState, action) {
  const {payload} = action
  switch (action.type) {
    case types.HANDLE_CHANNELS_TO_MENTION: {
      const {search, results} = payload
      if (search !== state.search) return state
      return {...state, channelsToMention: results}
    }
    case types.REQUEST_SEARCH_CHANNELS_TO_MENTION: {
      return {...state, search: payload}
    }
    default:
      return state
  }
}
