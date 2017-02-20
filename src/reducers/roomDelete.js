import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  room: null
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_ROOM_DELETE_DIALOG:
      return {
        show: true,
        room: action.payload
      }
    case types.HIDE_ROOM_DELETE_DIALOG:
      return {
        ...state,
        show: false
      }
    default:
      return state
  }
}
