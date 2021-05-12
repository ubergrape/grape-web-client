import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_MARKDOWN_TIPS:
      return {
        show: true,
      }
    case types.HIDE_MARKDOWN_TIPS:
      return {
        show: false,
      }
    default:
      return state
  }
}
