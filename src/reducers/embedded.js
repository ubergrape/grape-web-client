import * as types from '../constants/actionTypes'

const initialState = false

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.HANDLE_EMBEDDED_VERSION:
      return true
    default:
      return state
  }
}
