import * as types from '../constants/actionTypes'

const initialState = {
  loading: true
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.HANDLE_INITIAL_DATA:
      return {loading: false}
    default:
      return state
  }
}
