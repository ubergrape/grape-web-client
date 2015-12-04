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
    case types.SET_ORG:
    case types.SET_CHANNEL:
    case types.SHOW_SHARED_FILES:
    case types.HIDE_SHARED_FILES:
    case types.SET_SIDEBAR_IS_LOADING:
    case types.LOAD_SHARED_FILES:
    case types.LOADED_SHARED_FILES:
      return {...state, ...action.payload}
    case types.HANDLE_NEW_MESSAGE:
    default:
      return state
  }
}
