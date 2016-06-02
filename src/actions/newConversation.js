import * as types from '../constants/actionTypes'

export function showNewConversation() {
  return {
    type: types.SHOW_NEW_CONVERSATION
  }
}

export function showNewConversationAdvanced() {
  return {
    type: types.SHOW_NEW_CONVERSATION_ADVANCED
  }
}

export function hideNewConversation() {
  return {
    type: types.HIDE_NEW_CONVERSATION
  }
}

export function addToNewConversation(user) {
  return {
    type: types.ADD_TO_NEW_CONVERSATION,
    payload: user
  }
}

export function removeFromNewConversation(user) {
  return {
    type: types.REMOVE_FROM_NEW_CONVERSATION,
    payload: user
  }
}

export function filterNewConversation(value) {
  return {
    type: types.FILTER_NEW_CONVERSATION,
    payload: value
  }
}

export function newConversationCreateError(message) {
  return {
    type: types.SHOW_NEW_CONVERSATION_ERROR,
    payload: message
  }
}
