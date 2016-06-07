import findLast from 'lodash/collection/findLast'

import reduxEmitter from '../legacy/redux-emitter'
import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {
  userSelector, channelSelector, historySelector
} from '../selectors'
import {error} from './common'
import {showAlert, hideAlertByType} from './alert'
import * as alerts from '../constants/alerts'
import {formatMessage, filterEmptyMessage} from './utils'

export function loadHistory(channelId, options) {
  return (dispatch, getState) => {
    dispatch({type: types.REQUEST_HISTORY})
    dispatch(showAlert({
      level: 'info',
      type: alerts.LOADING_HISTORY,
      delay: 1000
    }))
    api
      .loadHistory(channelId, options)
      .then(messages => {
        const state = getState()
        const payload = messages
          .reverse()
          .map(message => formatMessage(message, state))
          .filter(filterEmptyMessage)

        dispatch({
          type: types.HANDLE_LOADED_HISTORY,
          payload
        })
        dispatch(hideAlertByType(alerts.LOADING_HISTORY))
      })
      .catch(err => dispatch(error(err)))
  }
}

export function removeMessage({id: messageId}) {
  return (dispatch, getState) => {
    dispatch({type: types.REQUEST_REMOVE_MESSAGE})
    const {id: channelId} = channelSelector(getState())
    api
      .removeMessage(channelId, messageId)
      .catch(err => dispatch(error(err)))
  }
}

export function editMessage(message) {
  return (dispatch) => {
    dispatch({
      type: types.EDIT_MESSAGE,
      payload: message
    })
    reduxEmitter.editMessage(message)
  }
}


export function editPreviousMessage() {
  return (dispatch, getState) => {
    const state = getState()
    const {messages} = historySelector(state)
    const user = userSelector(state)
    const message = findLast(messages, msg => msg.author.id === String(user.id))
    dispatch(editMessage(message))
  }
}

export function markAsUnsent(message) {
  return (dispatch) => {
    setTimeout(() => {
      dispatch({
        type: types.MARK_MESSAGE_AS_UNSENT,
        payload: message
      })
    }, 5000)
  }
}

export function createMessage({channelId, text, attachments = []}) {
  return (dispatch, getState) => {
    const state = getState()
    const id = Math.random().toString(36).substr(7)
    const author = userSelector(state)

    const message = formatMessage({
      id,
      text,
      author,
      time: new Date(),
      attachments,
      channel: channelId
    }, state)

    dispatch({
      type: types.ADD_PENDING_MESSAGE,
      payload: message
    })

    api
      .postMessage(channelId, text, {clientsideId: id, attachments})
      .catch(err => dispatch(error(err)))

    dispatch(markAsUnsent(message))
  }
}

export function handleUpdateMessage(message) {
  return (dispatch, getState) => {
    dispatch({
      type: types.UPDATE_MESSAGE,
      payload: formatMessage(message, getState())
    })
  }
}

export function resendMessage(message) {
  return (dispatch) => {
    dispatch({
      type: types.RESEND_MESSAGE,
      payload: message
    })
    dispatch(markAsUnsent(message))
  }
}
