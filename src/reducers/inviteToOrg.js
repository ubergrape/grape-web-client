import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  showError: false,
  showJustInvited: false,
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
        showJustInvited: false,
        showError: false
      }
    case types.SET_INVITE_TO_ORG_LINK:
      return {
        ...state,
        inviteLink: action.payload
      }
    case types.HANDLE_INVITE_TO_ORG_ERROR:
      return {
        ...state,
        showError: true
      }
    case types.HANDLE_INVITE_TO_ORG_SUCCESS:
      return {
        ...state,
        showJustInvited: true,
        showError: false
      }
    case types.CLEAR_INVITE_TO_ORG_ERROR:
      return {
        ...state,
        showError: false
      }
    case types.HIDE_JUST_INVITED_TO_ORG:
      return {
        ...state,
        showJustInvited: false
      }
    default:
      return state
  }
}
