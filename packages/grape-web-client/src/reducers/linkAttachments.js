import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_REMOVE_LINK_ATTACHMENT:
      return {
        show: true,
        ...action.payload,
      }
    case types.HIDE_REMOVE_LINK_ATTACHMENT:
      return {
        show: false,
      }
    default:
      return state
  }
}
