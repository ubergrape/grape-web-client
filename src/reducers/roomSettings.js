import * as types from '../constants/actionTypes'

const initialState = {
  nameError: undefined
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.RENAME_ROOM_REQUEST:
      return {...state, nameError: undefined}
    case types.RENAME_ROOM_ERROR:
      return {...state, nameError: action.payload}
    default:
      return state
  }
}
