import * as types from '../constants/actionTypes'

const initialState = {
  show: 'splash',
  auth: 'nok',
}

export default function reduce(state = initialState, action) {
  const { payload } = action
  switch (action.type) {
    case types.HANDLE_AUTH_STATUS:
      return {
        ...state,
        auth: payload,
        show: payload === 'ok' ? 'app' : 'login',
      }
    case types.HANDLE_CHANGE_ROUTE: {
      return { ...state, route: payload }
    }
    default:
      return state
  }
}
