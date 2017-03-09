import * as images from '../constants/images'
import * as types from '../constants/actionTypes'

const initialState = {
  limit: 20,
  currentChannelOnly: false,
  searchActivities: false,
  isLoading: false,
  items: [],
  query: [],
  total: undefined,
  images
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_SIDEBAR_IS_LOADING:
    case types.SEARCH_MESSAGES:
    case types.FOUND_MESSAGES:
    case types.UPDATE_MESSAGE_SEARCH_QUERY:
      return {...state, ...action.payload}
    case types.TOGGLE_SEARCH_IN_CHANNEL_ONLY:
      return {
        ...state,
        currentChannelOnly: !state.currentChannelOnly,
        items: initialState.items,
        limit: initialState.limit,
        total: initialState.total
      }
    case types.TOGGLE_SEARCH_ACTIVITIES:
      return {
        ...state,
        searchActivities: !state.searchActivities,
        items: initialState.items,
        limit: initialState.limit,
        total: initialState.total
      }
    default:
      return state
  }
}
