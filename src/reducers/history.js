import * as types from '../constants/actionTypes'

const initialState = {
  messages: []
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.HANDLE_LOADED_HISTORY: {
      console.log('handle history', action.payload)
      return {...state, messages: action.payload}
    }
    default:
      return state
  }
}
