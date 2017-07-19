import * as types from '../constants/actionTypes'

const initialState = {
  show: false
}

export default function reduce(state = initialState, action) {
  const {payload} = action
  switch (action.type) {
    case types.HANDLE_AUTH_STATUS:
      return {
        ...state,
        show: payload === 'ok'
      }
    default:
      return state
  }
}
