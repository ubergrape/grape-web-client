import * as types from '../constants/actionTypes'

const initialState = {
  show: true
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_INVITE_TO_ORG:
      return {
        ...initialState,
        show: true
      }
    case types.HIDE_INVITE_TO_ORG:
      return {
        ...initialState,
        show: false
      }
    default:
      return state
  }
}
