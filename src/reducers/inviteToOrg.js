import * as types from '../constants/actionTypes'

const initialState = {
  show: true,
  error: false,
  inviteLink: ''
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_INVITE_TO_ORG:
      return {
        ...state,
        show: true
      }
    case types.HIDE_INVITE_TO_ORG:
      return {
        ...state,
        show: false,
        error: false
      }
    case types.SET_INVITE_TO_ORG_LINK:
      return {
        ...state,
        inviteLink: action.payload
      }
    case types.HANDLE_INVITE_TO_ORG_ERROR:
      return {
        ...state,
        error: true
      }
    case types.CLEAR_INVITE_TO_ORG_ERROR:
      return {
        ...state,
        error: false
      }
    default:
      return state
  }
}
