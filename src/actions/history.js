import findLast from 'lodash/collection/findLast'
import last from 'lodash/array/last'

import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {
  userSelector,
  channelSelector,
  historySelector,
  orgSelector,
} from '../selectors'
import * as alerts from '../constants/alerts'
import {
  normalizeMessage,
  filterEmptyMessage,
  loadLabelsConfigCached,
} from './utils'
import { error, showAlert, hideAlertByType } from './'

function normalizeMessages(messages, state) {
  return messages
    .map(message => normalizeMessage(message, state))
    .filter(filterEmptyMessage)
}

// Clearing is used to enhance perceptional performance when clicked
// on a navigation in order to react immediately.
function loadLatest(options = { clear: true }) {
  return (dispatch, getState) => {
    const { minimumBatchSize: limit, channel } = historySelector(getState())

    if (options.clear) {
      dispatch({ type: types.CLEAR_HISTORY })
    }

    dispatch({
      type: types.REQUEST_LATEST_HISTORY,
      payload: { channel },
    })

    dispatch(
      showAlert({
        level: 'info',
        type: alerts.LOADING_HISTORY,
        delay: 1000,
      }),
    )

    api
      .loadHistory(channel.id, { limit })
      .then(res => {
        const messages = normalizeMessages(res.reverse(), getState())
        const lastMessage = last(messages)

        dispatch(hideAlertByType(alerts.LOADING_HISTORY))
        dispatch({
          type: types.HANDLE_INITIAL_HISTORY,
          payload: {
            messages,
            scrollTo: lastMessage ? lastMessage.id : null,
          },
        })
      })
      .catch(err => {
        dispatch(hideAlertByType(alerts.LOADING_HISTORY))
        dispatch(error(err))
      })
  }
}

/**
 * Load older messages.
 * May be called many of times in a row.
 */
function loadOlder(params) {
  return (dispatch, getState) => {
    const { startIndex, stopIndex } = params
    const { messages, olderMessages, channel } = historySelector(getState())

    // Ensures we don't have useless requests to the backend.
    if (olderMessages) return

    const promise = api.loadHistory(channel.id, {
      limit: stopIndex - startIndex,
      timeTo: messages[0].time,
    })

    dispatch({
      type: types.REQUEST_OLDER_HISTORY,
      payload: { params, promise, channel },
    })

    dispatch(
      showAlert({
        level: 'info',
        type: alerts.LOADING_HISTORY,
        delay: 1000,
      }),
    )

    promise
      .then(res => {
        dispatch(hideAlertByType(alerts.LOADING_HISTORY))
        return res
      })
      .catch(err => {
        dispatch(hideAlertByType(alerts.LOADING_HISTORY))
        dispatch(error(err))
      })
  }
}

/**
 * Load newer messages.
 * May be called many of times in a row.
 */
function loadNewer(params) {
  return (dispatch, getState) => {
    const { startIndex, stopIndex } = params
    const { messages, newerMessages, channel } = historySelector(getState())

    // Ensures we don't have useless requests to the backend.
    if (newerMessages) return

    const promise = api.loadHistory(channel.id, {
      limit: stopIndex - startIndex,
      timeFrom: last(messages).time,
      sort: 'time:asc',
    })

    dispatch({
      type: types.REQUEST_NEWER_HISTORY,
      payload: { promise, params, channel },
    })

    dispatch(
      showAlert({
        level: 'info',
        type: alerts.LOADING_HISTORY,
        delay: 1000,
      }),
    )

    promise
      .then(res => {
        dispatch(hideAlertByType(alerts.LOADING_HISTORY))
        dispatch({
          type: types.HANDLE_MORE_HISTORY,
          payload: {
            messages: normalizeMessages(res, getState()),
            isScrollBack: false,
          },
        })
      })
      .catch(err => {
        dispatch(hideAlertByType(alerts.LOADING_HISTORY))
        dispatch(error(err))
      })
  }
}

function loadFragment() {
  return (dispatch, getState) => {
    const {
      minimumBatchSize: limit,
      channel,
      selectedMessageId,
    } = historySelector(getState())

    dispatch({
      type: types.REQUEST_HISTORY_FRAGMENT,
      payload: { selectedMessageId, channel },
    })

    dispatch(
      showAlert({
        level: 'info',
        type: alerts.LOADING_HISTORY,
        delay: 1000,
      }),
    )

    api
      .loadHistoryAt(channel.id, selectedMessageId, { limit })
      .then(res => {
        dispatch(hideAlertByType(alerts.LOADING_HISTORY))
        dispatch({
          type: types.HANDLE_INITIAL_HISTORY,
          payload: {
            messages: normalizeMessages(res, getState()),
            scrollTo: selectedMessageId,
            selectedMessageId,
          },
        })
      })
      .catch(err => {
        dispatch(hideAlertByType(alerts.LOADING_HISTORY))
        dispatch(error(err))
      })
  }
}

export function loadHistory(options) {
  return (dispatch, getState) => {
    const { selectedMessageId } = historySelector(getState())
    dispatch(selectedMessageId ? loadFragment() : loadLatest(options))
  }
}

export { loadLatest as loadLatestHistory }

/**
 * Load older or newer messages.
 * May be called many of times in a row.
 */
export function loadMoreHistory(params) {
  return (dispatch, getState) => {
    const { messages } = historySelector(getState())
    if (params.startIndex < 0) dispatch(loadOlder(params))
    else if (messages.length) dispatch(loadNewer(params))
    else dispatch(loadLatest())
  }
}

/**
 * This callback is called when scroller reaches the top position.
 * It renders the loaded messages when promise gets resolved.
 */
export function renderOlderHistory() {
  return (dispatch, getState) => {
    const { olderMessages } = historySelector(getState())
    olderMessages.then(res => {
      dispatch({
        type: types.HANDLE_MORE_HISTORY,
        payload: {
          messages: normalizeMessages(res.reverse(), getState()),
          isScrollBack: true,
        },
      })
    })
  }
}

export function unsetHistoryScrollTo() {
  return {
    type: types.UNSET_HISTORY_SCROLL_TO,
  }
}

export function removeMessages(messages) {
  return (dispatch, getState) => {
    dispatch({
      type: types.REQUEST_REMOVE_MESSAGES,
      payload: messages,
    })
    const { id: channelId } = channelSelector(getState())

    Promise.all(
      messages.map(message => api.removeMessage(channelId, message.id)),
    ).catch(err => dispatch(error(err)))
  }
}

export function editMessage(message) {
  return dispatch => {
    dispatch({
      type: types.EDIT_MESSAGE,
      payload: message,
    })
  }
}

export function editMessageSend({ channelId, messageId, text }) {
  return dispatch => {
    api
      .updateMessage(channelId, messageId, text)
      .catch(err => dispatch(error(err)))

    dispatch({
      type: types.EDIT_MESSAGE_SEND,
      payload: { channelId, messageId, text },
    })
  }
}

export function editMessageAbort() {
  return { type: types.EDIT_MESSAGE_ABORT }
}

export function editPreviousMessage() {
  return (dispatch, getState) => {
    const state = getState()
    const { messages } = historySelector(state)
    const user = userSelector(state)
    const message = findLast(messages, msg => msg.author.id === user.id)
    dispatch(editMessage(message))
  }
}

export function markAsUnsent(message) {
  return dispatch => {
    setTimeout(() => {
      dispatch({
        type: types.MARK_MESSAGE_AS_UNSENT,
        payload: message,
      })
    }, 5000)
  }
}

export function readMessage({ channelId, messageId }) {
  return dispatch => {
    dispatch({
      type: types.REQUEST_READ_MESSAGE,
      payload: messageId,
    })
    api.readMessage(channelId, messageId).catch(err => dispatch(error(err)))
  }
}

export function createMessage({ channelId, text, attachments = [] }) {
  return (dispatch, getState) => {
    const state = getState()
    const id = Math.random()
      .toString(36)
      .substr(7)
    const author = userSelector(state)

    const message = normalizeMessage(
      {
        id,
        text,
        author,
        time: new Date(),
        attachments,
        channel: channelId,
      },
      state,
    )

    dispatch({
      type: types.REQUEST_POST_MESSAGE,
      payload: message,
    })

    const options = {
      clientsideId: id,
      attachments,
    }

    dispatch(markAsUnsent(message))

    api
      .postMessage(channelId, text, options)
      .then(messageId => {
        dispatch(readMessage({ channelId, messageId }))
      })
      .catch(err => dispatch(error(err)))
  }
}

export function handleMessageUpdate(message) {
  return (dispatch, getState) => {
    const state = getState()
    const orgId = orgSelector(state).id

    loadLabelsConfigCached(orgId).then(labelsConfig => {
      dispatch({
        type: types.UPDATE_MESSAGE,
        payload: normalizeMessage(message, state, labelsConfig),
      })
    })
  }
}

export function resendMessage(message) {
  return dispatch => {
    dispatch({
      type: types.RESEND_MESSAGE,
      payload: message,
    })
    dispatch(markAsUnsent(message))
  }
}

export function quoteMessage({ message }) {
  return dispatch => {
    dispatch({
      type: types.INSERT_MESSAGE_QUOTE,
      payload: message,
    })
  }
}
