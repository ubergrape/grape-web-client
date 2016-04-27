import * as types from '../constants/actionTypes'

const initialState = {
  error: undefined
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.RENAME_ROOM_REQUEST:
      return {error: undefined}
    case types.RENAME_ROOM_ERROR:
      return {error: action.payload}
    default:
      return state
  }
}
