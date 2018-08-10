import * as types from '../constants/actionTypes'

export function showNewConversation() {
  return {
    type: types.SHOW_NEW_CONVERSATION,
  }
}

export function hideNewConversation() {
  return {
    type: types.HIDE_NEW_CONVERSATION,
  }
}
