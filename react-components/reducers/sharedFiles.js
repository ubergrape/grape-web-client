import * as types from '../constants/actionTypes'
import * as images from '../constants/images'

const initialState = {
  show: false,
  images,
  items: [],
  isLoading: false,
  limit: 20
}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_SHARED_FILES:
    case types.HIDE_SHARED_FILES:
    case types.SET_SIDEBAR_IS_LOADING:
    case types.LOAD_SHARED_FILES:
    case types.LOADED_SHARED_FILES:
    case types.ADD_SHARED_FILE:
    case types.REMOVE_SHARED_FILE:
      return {...state, ...action.payload}
    case types.SET_CHANNEL:
      if (state.show) return {...initialState, show: true}
      return state
    default:
      return state
  }
}
