import * as images from '../constants/images'
import * as types from '../constants/actionTypes'

const initialState = {
  title: 'Mentions',
  limit: 20,
  show: false,
  isLoading: false,
  items: [],
  images
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_MENTIONS:
    case types.HIDE_MENTIONS:
    case types.SET_SIDEBAR_IS_LOADING:
    case types.LOADED_MENTIONS:
    case types.ADD_MENTION:
    case types.REMOVE_MENTION:
      return {...state, ...action.payload}
    default:
      return state
  }
}
