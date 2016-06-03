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
    case types.UPDATE_MESSAGE:
      return updateMessage(state, action.payload)
    case types.EDIT_MESSAGE:
      return updateMessage(state, {...action.payload, editMode: true})
    default:
      return state
  }
}
