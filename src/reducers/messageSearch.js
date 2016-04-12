import * as images from '../constants/images'
import * as types from '../constants/actionTypes'

const initialState = {
  title: 'Search Results',
  limit: 20,
  isLoading: false,
  items: [],
  query: [],
  images
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_MESSAGE_SEARCH:
    case types.HIDE_MESSAGE_SEARCH:
    case types.SET_SIDEBAR_IS_LOADING:
    case types.SEARCH_MESSAGES:
    case types.FOUND_MESSAGES:
    case types.UPDATE_MESSAGE_SEARCH_QUERY:
      return {...state, ...action.payload}
    default:
      return state
  }
}
