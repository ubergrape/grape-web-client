import * as types from '../constants/actionTypes'

const initialState = {}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_USER:
      return action.payload.user
    default:
      return state
  }
}
