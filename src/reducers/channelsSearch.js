import * as types from '../constants/actionTypes'

const initialState = {
  channelsToMention: []
}

export default function reduce(state = initialState, action) {
  const {payload} = action
  switch (action.type) {
    case types.HANDLE_CHANNELS_TO_MENTION:
      return {...state, channelsToMention: payload}
    case types.REQUEST_SEARCH_CHANNELS_TO_MENTION:
    default:
      return state
  }
}
