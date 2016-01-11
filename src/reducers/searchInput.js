import * as types from '../constants/actionTypes'

const initialState = {}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SEARCH_INPUT_KEY_PRESS:
      return {...state, ...action.payload}
    default:
      return state
  }
}
