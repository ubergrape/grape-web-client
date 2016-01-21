import * as types from '../constants/actionTypes'

const initialState = {
  show: true
}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_INVITE_CHANNEL_MEMBER_LIST:
      return {
        show: true
      }
    case types.HIDE_INVITE_CHANNEL_MEMBER_LIST:
      return {
        show: false
      }
    default:
      return state
  }
}
