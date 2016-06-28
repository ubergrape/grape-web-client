import * as types from '../constants/actionTypes'
import reject from 'lodash/collection/reject'
import findIndex from 'lodash/array/findIndex'

const initialState = {
  messages: [],
  cacheSize: 500,
  channelId: undefined
}

function updateMessage(state, nextMessage) {
  const index = findIndex(state.messages, {id: nextMessage.id})
  const prevMessage = state.messages[index]
  if (index === -1) return state
  const message = {...prevMessage, ...nextMessage}
  state.messages.splice(index, 1, message)
  return {...state, messages: [...state.messages]}
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_CHANNEL:
      return {...state, channelId: action.payload.channel.id}
    case types.HANDLE_INITIAL_HISTORY:
      if (!action.payload.length) return state
      return {...state, messages: action.payload}
    case types.HANDLE_MORE_HISTORY: {
      const {messages: newMessages, isScrollBack} = action.payload
      if (!newMessages.length) return state

      let messages

      if (isScrollBack) messages = [...newMessages, ...state.messages]
      else messages = [...state.messages, ...newMessages]

      return {...state, messages}
    }
    case types.REMOVE_MESSAGE:
      return {...state, messages: reject(state.messages, {id: action.payload})}
    case types.EDIT_MESSAGE:
      return updateMessage(state, {...action.payload, isSelected: true})
    case types.UPDATE_MESSAGE:
      return updateMessage(state, action.payload)
    case types.MARK_MESSAGE_AS_UNSENT:
      return updateMessage(state, {...action.payload, isUnsent: true})
    case types.RESEND_MESSAGE:
      return updateMessage(state, {
        ...action.payload,
        isPending: true,
        isUnsent: false
      })
    case types.MARK_MESSAGE_AS_SENT:
      return updateMessage(state, {id: action.payload.messageId, isSent: true})
    case types.MARK_CHANNEL_AS_READ:
      if (action.payload.channelId !== state.channelId ||
        action.payload.isCurrentUser) {
        return state
      }
      return {
        ...state,
        messages: state.messages.map(message => {
          if (message.isRead) return message
          return {
            ...message,
            isRead: true
          }
        })
      }
    case types.ADD_PENDING_MESSAGE:
      return {...state, messages: [
        ...state.messages,
        {...action.payload, isPending: true}
      ]}
    case types.ADD_NEW_MESSAGE: {
      const message = action.payload
      if (message.channel !== state.channelId) return state
      return {...state, messages: [...state.messages, message]}
    }
    default:
      return state
  }
}
