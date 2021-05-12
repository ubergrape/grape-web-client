import * as types from '../constants/actionTypes'

const initialState = {
  loading: true,
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_INITIAL_DATA_LOADING:
      return { loading: action.payload }
    default:
      return state
  }
}
