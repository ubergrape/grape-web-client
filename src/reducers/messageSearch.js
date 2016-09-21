import * as images from '../constants/images'
import * as types from '../constants/actionTypes'

const initialState = {
  limit: 20,
  searchOnlyInChannel: false,
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
    case types.TOGGLE_SEARCH_ONLY_IN_CHANNEL:
      return {
        ...state,
        searchOnlyInChannel: !state.searchOnlyInChannel,
        items: initialState.items,
        limit: initialState.limit,
        total: initialState.total
      }
    default:
      return state
  }
}
