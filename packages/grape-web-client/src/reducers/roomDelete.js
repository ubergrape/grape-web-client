import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_ROOM_DELETE_DIALOG:
      return {
        show: true,
        room: action.payload,
      }
    case types.HIDE_ROOM_DELETE_DIALOG:
      return {
        show: false,
      }
    default:
      return state
  }
}
