import * as types from '../constants/actionTypes'

const initialState = {
  show: false
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.HIDE_USER_PROFILE:
      return {show: false}
    case types.SHOW_USER_PROFILE:
      return {show: true}
    default:
      return state
  }
}
