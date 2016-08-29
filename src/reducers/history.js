import * as types from '../constants/actionTypes'
import reject from 'lodash/collection/reject'
import findIndex from 'lodash/array/findIndex'
import uniq from 'lodash/array/uniq'

const initialState = {
  messages: [],
  minimumBatchSize: 30
}

function updateMessage(state, newMessage) {
  const index = findIndex(state.messages, {id: newMessage.id})
  const currMessage = state.messages[index]
  if (index === -1) return state
  const message = {...currMessage, ...newMessage}
  state.messages.splice(index, 1, message)
  return {...state, messages: [...state.messages]}
}

export default function reduce(state = initialState, action) {
  const {payload} = action
  switch (action.type) {
    case types.SET_USER:
      return {...state, user: payload}
    case types.GO_TO_CHANNEL:
      // Clicked on the current channel.
      if (action.payload === state.channel.slug) return state
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
      if (payload.channelId !== state.channel.id || payload.isCurrentUser) {
        return state
      }

      return {
        ...state,
        messages: state.messages.map(message => {
          if (message.state === 'read') return message
          return {
            ...message,
            state: 'read'
          }
        })
      }
    }
    case types.ADD_PENDING_MESSAGE:
      return {
        ...state,
        messages: [
          ...state.messages,
          {...payload, state: 'pending'}
        ],
        noContent: false
      }
    case types.ADD_NEW_MESSAGE: {
      if (payload.channel !== state.channel.id) return state
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
