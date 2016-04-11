import * as types from '../constants/actionTypes'

const initialState = {
  show: false
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.HIDE_SIDEBAR:
    case types.HIDE_INTERCOM:
      return {show: false}
    case types.SHOW_INTERCOM:
      return {show: true}
    default:
      return state
  }
}
