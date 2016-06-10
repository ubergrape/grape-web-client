import findLast from 'lodash/collection/findLast'
import last from 'lodash/array/last'

import reduxEmitter from '../legacy/redux-emitter'
import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {
  userSelector, channelSelector, historySelector
} from '../selectors'
import {error} from './common'
import {showAlert, hideAlertByType} from './alert'
import * as alerts from '../constants/alerts'
import {normalizeMessage, filterEmptyMessage} from './utils'

export function loadHistory(params) {
  const {channelId, startIndex, stopIndex} = params
  const isInitial = startIndex === undefined
  const isScrollBack = startIndex < 0

  return (dispatch, getState) => {
    let options

    if (isInitial) {
      dispatch(showAlert({
        level: 'info',
        type: alerts.LOADING_HISTORY,
        delay: 1000
      }))
    } else {
      const {messages} = historySelector(getState())
      if (isScrollBack) {
        options = {timeTo: messages[0].time}
      } else {
        options = {timeFrom: last(messages).time}
      }
      options.limit = stopIndex - startIndex
    }

    dispatch({
      type: types.REQUEST_HISTORY,
      payload: {params, options}
    })

    api
      .loadHistory(channelId, options)
      .then(res => {
        const state = getState()
        const messages = res
          .reverse()
          .map(message => normalizeMessage(message, state))
          .filter(filterEmptyMessage)

        if (isInitial) {
          dispatch({
            type: types.HANDLE_INITIAL_HISTORY,
            payload: messages
          })
          dispatch(hideAlertByType(alerts.LOADING_HISTORY))
          return
        }

        dispatch({
          type: types.HANDLE_MORE_HISTORY,
          payload: {
            messages,
            ...params,
            isScrollBack
          }
        })
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

    const message = normalizeMessage({
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

export function handleMessageUpdate(message) {
  return (dispatch, getState) => {
    dispatch({
      type: types.UPDATE_MESSAGE,
      payload: normalizeMessage(message, getState())
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
