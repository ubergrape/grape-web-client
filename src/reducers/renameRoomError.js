import * as types from '../constants/actionTypes'

const initialState = {
  message: undefined,
  // We ususaly got the same error message,
  // but component should be updated with new props.
  id: 0
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.REQUEST_ROOM_RENAME:
      return {message: undefined, id: state.id++}
    case types.HANDLE_ROOM_RENAME_ERROR:
      return {message: action.payload, id: state.id++}
    default:
      return state
  }
}
