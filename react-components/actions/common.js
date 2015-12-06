import page from 'page'

import * as types from '../constants/actionTypes'
import {addAttachments} from './sharedFiles'
import {addMention} from './mentions'
import {isMentioned, formatMessage} from './utils'

export function setSidebarIsLoading(isLoading) {
  return {
    type: types.SET_SIDEBAR_IS_LOADING,
    payload: {
      isLoading
    }
  }
}

export function handleNewMessage(message) {
  return dispatch => {
    const fMessage = formatMessage(message)
    if (message.attachments.length) {
      dispatch(addAttachments(fMessage))
    }
    if (isMentioned(fMessage)) {
      dispatch(addMention(fMessage))
    }
    dispatch({
      type: types.HANDLE_NEW_MESSAGE,
      payload: {
        message: fMessage
      }
    })
  }
}

export function goToMessage(message) {
  page(`/chat/${message.slug}/${message.id}`)
  return {
    type: types.GO_TO_MESSAGE,
    payload: {
      message
    }
  }
}
