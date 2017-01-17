import * as types from '../constants/actionTypes'

const initialState = {
  isHighlighted: false
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.EDIT_MESSAGE:
      return {isHighlighted: true}
    case types.HANDLE_OUTGOING_MESSAGE:
    case types.SET_CHANNEL:
    case types.END_EDIT_MESSAGE:
      return {isHighlighted: false}
    default:
      return state
  }
}
