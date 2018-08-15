import reject from 'lodash/reject'
import findIndex from 'lodash/findIndex'
import uniq from 'lodash/uniq'

import * as types from '../constants/actionTypes'
import conf from '../conf'

const initialState = {
  messages: [],
  minimumBatchSize: 50,
  receivedMessageViaSocket: false,
  scrollTo: null,
  scrollToAlignment: null,
}

function updateMessage(state, newMessage) {
  const { messages } = state
  const index = findIndex(messages, { id: newMessage.id })
  const currMessage = messages[index]
  if (index === -1) return state
  const message = { ...currMessage, ...newMessage }
  messages.splice(index, 1, message)
  return { ...state, messages: [...messages] }
}

/**
 * Mark last message as read, set `state` on all other messages to `undefined`
 * to remove the status mark.
 */
function markLastMessageAsRead(messages, senderId) {
  return messages.map((message, index) => {
    if (!message.state || message.author.id === senderId) return message
    return {
      ...message,
      state: index === messages.length - 1 ? 'read' : undefined,
    }
  })
}

export default function reduce(state = initialState, action) {
  const { payload } = action
  switch (action.type) {
    case types.SET_USER:
      return { ...state, user: payload }
    case types.SET_CHANNEL:
      return {
        ...state,
        channel: payload.channel,
        selectedMessageId: payload.messageId,
        selectedMessageIdTimestamp: Date.now(),
        olderMessages: undefined,
        newerMessages: undefined,
      }
    case types.SET_USERS:
      return { ...state, users: payload }
    case types.HANDLE_INITIAL_HISTORY:
      return {
        ...state,
        ...payload,
        showNoContent: payload.messages.length === 0 && !conf.embed,
        receivedMessageViaSocket: false,
      }
    case types.HANDLE_MORE_HISTORY: {
      const { messages: newMessages, isScrollBack } = payload
      if (!newMessages.length) return state

      let messages
      let { olderMessages, newerMessages } = state

      if (isScrollBack) {
        messages = [...newMessages, ...state.messages]
        olderMessages = undefined
      } else {
        messages = [...state.messages, ...newMessages]
        newerMessages = undefined
      }

      messages = uniq(messages, 'id')

      return {
        ...state,
        messages,
        scrollTo: null,
        scrollToAlignment: null,
        olderMessages,
        newerMessages,
        showNoContent: false,
        receivedMessageViaSocket: false,
      }
    }
    case types.GO_TO_CHANNEL:
      // Clicked on the current channel.
      if (state.channel && payload === state.channel.id) return state
      return { ...state, messages: [] }
    // when the client is disconnected and re-connects SET_INITIAL_DATA_LOADING is triggered
    // to avoid unexpected behaviour from existing data this case resets the state
    case types.SET_INITIAL_DATA_LOADING:
      if (!payload) return state
      return { ...initialState }
    case types.RESET_HISTORY_CHANNEL:
      return {
        ...state,
        channel: null,
      }
    case types.CLEAR_HISTORY:
      return { ...state, messages: [] }
    case types.REQUEST_OLDER_HISTORY:
      return { ...state, olderMessages: payload.promise }
    case types.REQUEST_NEWER_HISTORY:
      return { ...state, newerMessages: payload.promise }
    case types.UNSET_HISTORY_SCROLL_TO:
      return {
        ...state,
        scrollTo: null,
        scrollToAlignment: null,
        receivedMessageViaSocket: false,
      }
    case types.REMOVE_MESSAGE:
      return { ...state, messages: reject(state.messages, { id: payload }) }
    case types.EDIT_MESSAGE:
      return updateMessage(state, { ...payload, isSelected: true })
    case types.UPDATE_MESSAGE:
      return updateMessage(state, payload)
    case types.MARK_MESSAGE_AS_UNSENT:
      return updateMessage(state, { ...payload, state: 'unsent' })
    case types.RESEND_MESSAGE:
      return updateMessage(state, {
        ...payload,
        state: 'pending',
      })
    case types.MARK_MESSAGE_AS_SENT:
      return updateMessage(state, { id: payload.messageId, state: 'sent' })
    case types.MARK_CHANNEL_AS_READ: {
      // Currently backend logic is designed to mark all messages as read once
      // user read something in that channel.
      // This is not very accurate and might change in the future. So lets not couple
      // the rest of the logic with this design and use data structure which allows
      // individual messages to have different states.
      const { channelId, isCurrentUser, userId } = payload
      if (channelId !== state.channel.id || isCurrentUser) {
        return state
      }

      return {
        ...state,
        messages: markLastMessageAsRead(state.messages, userId),
      }
    }
    case types.REQUEST_POST_MESSAGE:
      // Message was sent to a non-active channel. Happens for e.g. when
      // uploading files. Avoid a message flash in the wrong channel.
      if (state.channel && payload.channelId !== state.channel.id) {
        return state
      }
      return {
        ...state,
        messages: [...state.messages, { ...payload, state: 'pending' }],
        showNoContent: false,
        receivedMessageViaSocket: false,
      }
    case types.ADD_NEW_MESSAGE: {
      if (payload.channelId !== state.channel.id) return state
      const scrollTo = payload.author.id === state.user.id ? payload.id : null
      return {
        ...state,
        scrollTo,
        scrollToAlignment: null,
        messages: [...state.messages, payload],
        showNoContent: false,
        receivedMessageViaSocket: true,
      }
    }
    default:
      return state
  }
}
