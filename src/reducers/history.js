import * as types from '../constants/actionTypes'
import reject from 'lodash/collection/reject'
import findIndex from 'lodash/array/findIndex'
import uniq from 'lodash/array/uniq'

const initialState = {
  messages: [],
  cacheSize: 500
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
    case types.SET_CHANNEL:
      return {
        ...state,
        channelId: payload.channel.id,
        messageId: payload.messageId
      }
    case types.HANDLE_INITIAL_HISTORY:
      // No need to rerender if no messages been loaded.
      if (!payload.messages.length) return state
      return {...state, ...payload}
    case types.HANDLE_MORE_HISTORY: {
      const {messages: newMessages, isScrollBack} = payload
      if (!newMessages.length) return state

      let messages

      if (isScrollBack) messages = [...newMessages, ...state.messages]
      else messages = [...state.messages, ...newMessages]

      messages = uniq(messages, 'id')

      return {...state, messages, scrollTo: null}
    }
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
      if (payload.channelId !== state.channelId || payload.isCurrentUser) {
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
      return {...state, messages: [
        ...state.messages,
        {...payload, state: 'pending'}
      ]}
    case types.ADD_NEW_MESSAGE: {
      if (payload.channel !== state.channelId) return state
      return {...state, messages: [...state.messages, payload]}
    }
    default:
      return state
  }
}
