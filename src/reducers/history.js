import * as types from '../constants/actionTypes'
import reject from 'lodash/collection/reject'

const initialState = {
  messages: []
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.HANDLE_LOADED_HISTORY:
      return {...state, messages: action.payload}
    case types.REMOVE_MESSAGE:
      return {...state, messages: reject(state.messages, {id: action.payload})}
    default:
      return state
  }
}
