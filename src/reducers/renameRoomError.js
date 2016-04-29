import * as types from '../constants/actionTypes'

const initialState = {
  error: undefined
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.REQUEST_ROOM_RENAME:
    case types.CLEAR_HANDLE_ROOM_RENAME_ERROR:
      return {error: undefined}
    case types.HANDLE_ROOM_RENAME_ERROR:
      return {error: action.payload}
    default:
      return state
  }
}
