import * as types from '../constants/actionTypes'
import * as images from '../constants/images'

const initialState = {
  images,
  items: [],
  isLoading: false,
  limit: 20,
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_SIDEBAR_IS_LOADING:
    case types.LOAD_SHARED_FILES:
    case types.LOADED_SHARED_FILES:
    case types.ADD_SHARED_FILE:
    case types.REMOVE_SHARED_FILE:
      return { ...state, ...action.payload }
    case types.SET_CHANNEL:
      return initialState
    default:
      return state
  }
}
