import * as types from '../constants/actionTypes'
import reject from 'lodash/collection/reject'
import findIndex from 'lodash/array/findIndex'

const initialState = {
  messages: []
}

function updateMessage(state, message) {
  const index = findIndex(state.messages, {id: message.id})
  if (index === -1) return state
  state.messages.splice(index, 1, message)
  return {...state, messages: [...state.messages]}
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.HANDLE_LOADED_HISTORY:
      return {...state, messages: action.payload}
    case types.REMOVE_MESSAGE:
      return {...state, messages: reject(state.messages, {id: action.payload})}
    case types.EDIT_MESSAGE:
      return updateMessage(state, {...action.payload, editMode: true})
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
    case types.ADD_PENDING_MESSAGE:
      return {...state, messages: [
        ...state.messages,
        {...action.payload, isPending: true}
      ]}
    case types.ADD_NEW_MESSAGE:
      return {...state, messages: [...state.messages, action.payload]}
    default:
      return state
  }
}
