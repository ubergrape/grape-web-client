import * as types from '../constants/actionTypes'
import reject from 'lodash/collection/reject'
import findIndex from 'lodash/array/findIndex'
import uniq from 'lodash/array/uniq'

const initialState = {
  messages: [],
  minimumBatchSize: 30
}

function updateMessage(state, newMessage) {
  const {messages} = state
  const index = findIndex(messages, {id: newMessage.id})
  const currMessage = messages[index]
  if (index === -1) return state
  const message = {...currMessage, ...newMessage}
  messages.splice(index, 1, message)
  return {...state, messages: [...messages]}
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
      state: index === messages.length - 1 ? 'read' : undefined
    }
  })
}

export default function reduce(state = initialState, action) {
  const {payload} = action
  switch (action.type) {
    case types.SET_USER:
      return {...state, user: payload}
    case types.GO_TO_CHANNEL:
      // Clicked on the current channel.
      if (payload === state.channel.slug) return state
      return {...state, messages: []}
    case types.SET_CHANNEL:
      return {
        ...state,
        channel: payload.channel,
        selectedMessageId: payload.messageId,
        olderMessages: undefined,
        newerMessages: undefined,
        noContent: false
      }
    case types.HANDLE_INITIAL_HISTORY:
      return {
        ...state,
        ...payload,
        noContent: payload.messages.length === 0
      }
    case types.HANDLE_MORE_HISTORY: {
      const {messages: newMessages, isScrollBack} = payload
      if (!newMessages.length) return state

      let messages
      let {olderMessages, newerMessages} = state

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
        olderMessages,
        newerMessages,
        noContent: false
      }
    }
    case types.REQUEST_LATEST_HISTORY:
      return {...state, messages: []}
    case types.REQUEST_OLDER_HISTORY:
      return {...state, olderMessages: payload.promise}
    case types.REQUEST_NEWER_HISTORY:
      return {...state, newerMessages: payload.promise}
    case types.UNSET_HISTORY_SCROLL_TO:
      return {...state, scrollTo: null}
    case types.REMOVE_MESSAGE:
      return {...state, messages: reject(state.messages, {id: payload})}
    case types.EDIT_MESSAGE:
      return updateMessage(state, {...payload, isSelected: true})
    case types.UPDATE_MESSAGE:
      return updateMessage(state, payload)
    case types.MARK_MESSAGE_AS_UNSENT:
      return updateMessage(state, {...payload, state: 'unsent'})
    case types.RESEND_MESSAGE:
      return updateMessage(state, {
        ...payload,
        state: 'pending'
      })
    case types.MARK_MESSAGE_AS_SENT:
      return updateMessage(state, {id: payload.messageId, state: 'sent'})
    case types.MARK_CHANNEL_AS_READ: {
      // Currently backend logic is designed to mark all messages as read once
      // user read something in that channel.
      // This is not very accurate and might change in the future. So lets not couple
      // the rest of the logic with this design and use data structure which allows
      // individual messages to have different states.
      const {channelId, isCurrentUser, userId} = payload
      if (channelId !== state.channel.id || isCurrentUser) {
        return state
      }

      return {
        ...state,
        messages: markLastMessageAsRead(state.messages, userId)
      }
    }
    case types.HANDLE_OUTGOING_MESSAGE:
      return {
        ...state,
        messages: [
          ...state.messages,
          {...payload, state: 'pending'}
        ],
        noContent: false
      }
    case types.ADD_NEW_MESSAGE: {
      if (payload.channelId !== state.channel.id) return state
      const scrollTo = payload.author.id === state.user.id ? payload.id : null
      return {
        ...state,
        scrollTo,
        messages: [...state.messages, payload],
        noContent: false
      }
    }
    default:
      return state
  }
}
