import * as types from '../constants/actionTypes'

const initialState = {}

export default function reduce(state = initialState, action) {
  const {payload} = action

  switch (action.type) {
    case types.HANDLE_LOADED_LABELS:
      return {
        ...state,
        labels: payload
      }
    case types.HIDE_SIDEBAR:
      return initialState
    default:
      return state
  }
}
