import * as types from '../constants/actionTypes'

const initialState = {
  isOpen: false,
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_NEW_CONVERSATION:
      return {
        ...initialState,
        isOpen: true,
      }
    case types.HIDE_NEW_CONVERSATION:
      return initialState
    default:
      return state
  }
}
