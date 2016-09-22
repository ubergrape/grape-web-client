import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  error: false,
  justInvited: false,
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
        justInvited: false,
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
    case types.HANDLE_INVITE_TO_ORG_SUCCESS:
      return {
        ...state,
        justInvited: true,
        error: false
      }
    case types.CLEAR_INVITE_TO_ORG_ERROR:
      return {
        ...state,
        error: false
      }
    case types.CLEAR_JUST_INVITED_TO_ORG:
      return {
        ...state,
        justInvited: false
      }
    default:
      return state
  }
}
