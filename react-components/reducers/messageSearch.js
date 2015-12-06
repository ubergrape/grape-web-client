import * as images from '../constants/images'
import * as types from '../constants/actionTypes'

const initialState = {
  title: 'Search Results',
  limit: 20,
  show: false,
  isLoading: false,
  items: [],
  images
}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_MESSAGE_SEARCH:
    case types.FOUND_MESSAGES:
    case types.UPDATE_MESSAGE_SEARCH_QUERY:
      return {...state, ...action.payload}
    default:
      return state
  }
}
