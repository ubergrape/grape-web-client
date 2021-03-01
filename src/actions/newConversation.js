import * as types from '../constants/actionTypes'

export const showNewConversation = () => {
  return {
    type: types.SHOW_NEW_CONVERSATION,
  }
}

export const hideNewConversation = () => {
  return {
    type: types.HIDE_NEW_CONVERSATION,
  }
}
