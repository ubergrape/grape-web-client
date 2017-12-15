import * as types from '../constants/actionTypes'

const initialState = {}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.HANDLE_CHANNEL_MEMBERS:
      return {...state, users: action.payload}
    default:
      return state
  }
}
