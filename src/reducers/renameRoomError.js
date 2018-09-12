import * as types from '../constants/actionTypes'

const initialState = {
  message: undefined,
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.REQUEST_ROOM_RENAME:
    case types.CLEAR_ROOM_RENAME_ERROR:
      return { message: undefined }
    case types.HANDLE_ROOM_RENAME_ERROR:
      return { message: action.payload }
    default:
      return state
  }
}
