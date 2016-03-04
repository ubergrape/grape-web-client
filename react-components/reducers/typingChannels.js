import * as types from '../constants/actionTypes'

const initialState = {}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_TYPING_USERS:
      return {...state, ...action.payload}
    default:
      return state
  }
}
