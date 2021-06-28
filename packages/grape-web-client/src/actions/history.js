import findLast from 'lodash/findLast'
import last from 'lodash/last'
import moment from 'moment'

import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { userSelector, channelSelector, historySelector } from '../selectors'
import * as alerts from '../constants/alerts'
import {
  SCROLL_TO_ALIGNMENT_START,
  SCROLL_TO_ALIGNMENT_END,
} from '../constants/history'
import { normalizeMessage, filterEmptyMessage } from './utils'
import { error, showAlert, hideAlertByType } from './'

function normalizeMessages(messages, state) {
  return messages
    .map(message => normalizeMessage(message, state))
    .filter(filterEmptyMessage)
}

const getUnsentMesssages = () =>
  localStorage.unsentMessages ? JSON.parse(localStorage.unsentMessages) : {}

// Clearing is used to enhance perceptional performance when clicked
// on a navigation in order to react immediately.
function loadLatest(options = { clear: true }) {
  return (dispatch, getState) => {
    const channel = channelSelector(getState())
    const { minimumBatchSize: limit } = historySelector(getState())

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
      .loadLatestHistory(channel.id, limit)
      .then(res => {
        const unsentMessages = getUnsentMesssages()

        let channelUnsentMessages = []

        if (unsentMessages[channel.id]) {
          channelUnsentMessages = unsentMessages[channel.id]
            .filter(
              ({ clientsideId }) =>
                !res.messages.find(
                  ({ clientsideId: id }) => id === clientsideId,
                ),
            )
            .reverse()

          unsentMessages[channel.id] = channelUnsentMessages

          localStorage.setItem('unsentMessages', JSON.stringify(unsentMessages))
        }

        const messages = normalizeMessages(
          [...channelUnsentMessages, ...res.messages].reverse(),
          getState(),
        )
        const lastMessage = last(messages)

        dispatch(hideAlertByType(alerts.LOADING_HISTORY))
        dispatch({
          type: types.HANDLE_INITIAL_HISTORY,
          payload: {
            messages,
            scrollTo: lastMessage ? lastMessage.id : null,
            scrollToAlignment: lastMessage ? SCROLL_TO_ALIGNMENT_END : null,
            backendHasNewerMessages: false,
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
    const channel = channelSelector(getState())
    const { messages, olderMessagesRequest } = historySelector(getState())

    // There is a race-condition where loadOlder is invoked before we actually
    // have messages in the store. Canceling this one function is not an issue
    // since it is invoked many times when you scroll up.
    if (messages.length === 0) return

    // Ensures we don't have useless requests to the backend.
    if (olderMessagesRequest) return

    const promise = api.loadOlderHistory(
      channel.id,
      stopIndex - startIndex,
      messages[0].time,
    )

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
    const channel = channelSelector(getState())
    const { messages, newerMessagesRequest } = historySelector(getState())

    // Ensures we don't have useless requests to the backend.
    if (newerMessagesRequest) return

    const promise = api.loadNewerHistory(
      channel.id,
      stopIndex - startIndex,
      last(messages).time,
      'time:asc',
    )

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
            messages: normalizeMessages(res.messages, getState()),
            isScrollBack: false,
            backendHasNewerMessages: res.backendHasNewerMessages,
          },
        })
      })
      .catch(err => {
        dispatch(hideAlertByType(alerts.LOADING_HISTORY))
        dispatch(error(err))
      })
  }
}

const handleBadMessage = () => dispatch => {
  dispatch(loadLatest())
  dispatch(
    showAlert({
      level: 'warning',
      type: alerts.MESSAGE_NOT_FOUND,
      closeAfter: 6000,
      isClosable: true,
    }),
  )
}

function loadFragment() {
  return (dispatch, getState) => {
    const channel = channelSelector(getState())
    const { minimumBatchSize: limit, selectedMessageId } = historySelector(
      getState(),
    )

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
            messages: normalizeMessages(res.messages, getState()),
            scrollTo: selectedMessageId,
            scrollToAlignment: SCROLL_TO_ALIGNMENT_START,
            selectedMessageId,
            backendHasNewerMessages: res.backendHasNewerMessages,
          },
        })
      })
      .catch(err => {
        dispatch(hideAlertByType(alerts.LOADING_HISTORY))
        if (err.message === 'Message Not Found') {
          dispatch(handleBadMessage())
        } else {
          dispatch(error(err))
        }
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
    const { olderMessagesRequest } = historySelector(getState())
    olderMessagesRequest.then(res => {
      dispatch({
        type: types.HANDLE_MORE_HISTORY,
        payload: {
          messages: normalizeMessages(res.messages.reverse(), getState()),
          isScrollBack: true,
          // set to undefined since loading older messages doesn't provide this information
          backendHasNewerMessages: undefined,
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

export const setScrollTop = payload => disptach => {
  disptach({
    type: types.SET_SCROLL_TOP,
    payload,
  })
}

export function removeMessages(messages) {
  return (dispatch, getState) => {
    dispatch({
      type: types.REQUEST_REMOVE_MESSAGES,
      payload: messages,
    })
    const { id: channelId } = channelSelector(getState())

    Promise.all(
      messages.map(({ id, state }) => {
        if (state === 'unsent') {
          const unsentMessages = getUnsentMesssages()

          let currChannel = unsentMessages[channelId] || []
          currChannel = currChannel.filter(msg => msg.id !== id)
          unsentMessages[channelId] = currChannel

          localStorage.setItem('unsentMessages', JSON.stringify(unsentMessages))

          dispatch({
            type: types.REMOVE_MESSAGE,
            payload: id,
          })

          return Promise.resolve()
        }
        return api.removeMessage(channelId, id)
      }),
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

export function editMessageSend({ channelId, message, text }) {
  return dispatch => {
    const { id, state } = message

    if (state === 'unsent') {
      dispatch(
        editMessage({
          ...message,
          text,
          time: moment().toISOString(true),
          userTime: moment().toISOString(true),
        }),
      )
      dispatch({
        type: types.EDIT_MESSAGE_SEND,
      })

      const unsentMessages = getUnsentMesssages()

      let currChannel = unsentMessages[channelId] || []
      currChannel = currChannel.map(msg => {
        if (msg.id === id) {
          return {
            ...msg,
            text,
            time: moment().toISOString(true),
            userTime: moment().toISOString(true),
          }
        }
        return msg
      })
      unsentMessages[channelId] = currChannel

      localStorage.setItem('unsentMessages', JSON.stringify(unsentMessages))
      return
    }

    api.updateMessage(channelId, id, text).catch(err => dispatch(error(err)))

    dispatch({
      type: types.EDIT_MESSAGE_SEND,
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
    // Prevent from editing message which didn't sent yet
    if (message.state === 'pending') return
    dispatch(editMessage(message))
  }
}

export function markAsUnsent(message) {
  return dispatch => {
    const { channelId, id } = message
    const unsentMessages = getUnsentMesssages()

    const currChannel = unsentMessages[channelId] || []
    if (!currChannel.some(msg => msg.id === id)) {
      currChannel.push({
        ...message,
        state: 'unsent',
      })
      unsentMessages[channelId] = currChannel
    }

    localStorage.setItem('unsentMessages', JSON.stringify(unsentMessages))

    setTimeout(() => {
      dispatch({
        type: types.MARK_MESSAGE_AS_UNSENT,
        payload: message,
      })
    }, 5000)
  }
}

export function readMessage({ channelId, messageId, unsentMessageId }) {
  return dispatch => {
    if (unsentMessageId) {
      const unsentMessages = getUnsentMesssages()

      let currChannel = unsentMessages[channelId] || []
      currChannel = currChannel.filter(msg => msg.id !== unsentMessageId)
      unsentMessages[channelId] = currChannel

      localStorage.setItem('unsentMessages', JSON.stringify(unsentMessages))
    }

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
    const { id: currentChannelId } = channelSelector(state)

    const message = normalizeMessage(
      {
        // Nik: I consider assigning the clientsideId to id bad software design,
        // Still I'm concerned that some part of the code relies on it and
        // in order to ship a stable version we are going to keep it for now.
        id,
        clientsideId: id,
        text,
        author,
        time: moment().toISOString(true),
        attachments,
        channel: channelId,
      },
      state,
    )

    if (state.history.backendHasNewerMessages) {
      // TODO avoid triggering loadLatest twice and ideal wait on the response to then append the new
      // message using REQUEST_POST_MESSAGE, followed by markAsUnsent, followed by sending the API call
      // background: this call triggers loadLatest, but once it's done the component also triggers load latest
      dispatch(loadLatest())

      // TODO! THIS IS BAD as it relies on loadLatest being done quicker than postMessage comes back
      // as mentioned above, after refactoring we can wait on loadLatest and then execute this codeblock
      setTimeout(() => {
        dispatch({
          type: types.REQUEST_POST_MESSAGE,
          payload: {
            ...message,
            channelId,
            currentChannelId,
          },
        })

        const options = {
          clientsideId: id,
          attachments,
        }

        dispatch(markAsUnsent(message))
        api
          .postMessage(channelId, text, options)
          .then(messageId => {
            dispatch(readMessage({ channelId, messageId, unsentMessageId: id }))
          })
          .catch(err => dispatch(error(err)))
      }, 800)
    } else {
      dispatch({
        type: types.REQUEST_POST_MESSAGE,
        payload: {
          ...message,
          channelId,
          currentChannelId,
        },
      })

      const options = {
        clientsideId: id,
        attachments,
      }

      dispatch(markAsUnsent(message))
      api
        .postMessage(channelId, text, options)
        .then(messageId => {
          dispatch(readMessage({ channelId, messageId, unsentMessageId: id }))
        })
        .catch(err => dispatch(error(err)))
    }
  }
}

export function resendMessage(message) {
  return dispatch => {
    dispatch({
      type: types.RESEND_MESSAGE,
      payload: message,
    })

    const { text, id, channelId, attachments } = message

    const options = {
      clientsideId: id,
      attachments,
    }

    api
      .postMessage(channelId, text, options)
      .then(messageId => {
        dispatch(readMessage({ channelId, messageId, unsentMessageId: id }))
      })
      .catch(err => dispatch(error(err)))
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
