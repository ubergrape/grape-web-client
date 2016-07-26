import find from 'lodash/collection/find'
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

function normalizeMessages(messages, state) {
  return messages
    .reverse()
    .map(message => normalizeMessage(message, state))
    .filter(filterEmptyMessage)
}

function loadLatest({channelId}) {
  return (dispatch, getState) => {
    // It is initial loading, show loading indicator.
    dispatch(showAlert({
      level: 'info',
      type: alerts.LOADING_HISTORY,
      delay: 1000
    }))

    api
      .loadHistory(channelId)
      .then(res => {
        const messages = normalizeMessages(res, getState())
        dispatch({
          type: types.HANDLE_INITIAL_HISTORY,
          payload: {
            messages,
            scrollTo: last(messages).id
          }
        })
        dispatch(hideAlertByType(alerts.LOADING_HISTORY))
      })
      .catch(err => dispatch(error(err)))
  }
}

function loadMore({startIndex, stopIndex, channelId}) {
  return (dispatch, getState) => {
    const isScrollBack = startIndex < 0
    const options = {
      limit: stopIndex - startIndex
    }
    const {messages} = historySelector(getState())

    if (isScrollBack) {
      options.timeTo = messages[0].time
    } else {
      options.timeFrom = last(messages).time
    }

    api
      .loadHistory(channelId, options)
      .then(res => {
        dispatch({
          type: types.HANDLE_MORE_HISTORY,
          payload: {
            messages: normalizeMessages(res, getState()),
            isScrollBack
          }
        })
      })
      .catch(err => dispatch(error(err)))
  }
}

function loadFragment({channelId}, messageId) {
  return (dispatch, getState) => {
    api
      .loadHistoryAt(channelId, messageId)
      .then(res => {
        dispatch({
          type: types.HANDLE_INITIAL_HISTORY,
          payload: {
            messages: normalizeMessages(res, getState()),
            scrollTo: messageId
          }
        })
      })
      .catch(err => dispatch(error(err)))
  }
}

export function loadHistory(params) {
  return (dispatch, getState) => {
    dispatch({
      type: types.REQUEST_HISTORY,
      payload: params
    })

    if (!params.jumpToEnd) {
      if (params.startIndex !== undefined) return dispatch(loadMore(params))

      const {selectedMessageId: messageId} = historySelector(getState())
      if (messageId) return dispatch(loadFragment(params, messageId))
    }

    return dispatch(loadLatest(params))
  }
}

export function removeMessage({id: messageId}) {
  return (dispatch, getState) => {
    dispatch({
      type: types.REQUEST_REMOVE_MESSAGE,
      payload: messageId
    })
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

export function readMessage({id: messageId}) {
  return (dispatch, getState) => {
    dispatch({
      type: types.REQUEST_READ_MESSAGE,
      payload: messageId
    })
    const {id: channelId} = channelSelector(getState())
    api
      .readMessage(channelId, messageId)
      .catch(err => dispatch(error(err)))
  }
}
