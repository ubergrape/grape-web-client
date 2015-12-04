import * as types from '../constants/actionTypes'
import {addAttachments} from './sharedFiles'

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
    if (message.attachments.length) {
      dispatch(addAttachments(message))
    }
    dispatch({
      type: types.HANDLE_NEW_MESSAGE,
      payload: {
        message
      }
    })
  }
}
