import * as types from '../constants/actionTypes'

export const initialState = {
  show: false,
}

export default (state = initialState, action) => {
  const { type } = action
  switch (type) {
    case types.SHOW_LEAVE_CHANNEL_DIALOG:
      return {
        show: true,
      }
    case types.HIDE_LEAVE_CHANNEL_DIALOG:
      return {
        show: false,
      }
    default:
      return state
  }
}
