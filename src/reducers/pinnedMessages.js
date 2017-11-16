import * as types from '../constants/actionTypes'

const initialState = {
  items: [],
  isLoading: false
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_SIDEBAR_IS_LOADING:
    case types.REQUEST_PINNED_MESSAGES:
    case types.HANDLE_PINNED_MESSAGES:
    case types.ADD_PINNED_MESSAGE:
    case types.REMOVE_PINNED_MESSAGE:
      return {...state, ...action.payload}
    case types.SET_CHANNEL:
      return {...initialState}
    default:
      return state
  }
}
