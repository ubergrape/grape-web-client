import * as types from '../constants/actionTypes'

const initialState = {
  show: undefined
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.HIDE_SIDEBAR:
      return {show: undefined}
    case types.SHOW_IN_SIDEBAR:
      return {show: action.payload}
    default:
      return state
  }
}
