import * as types from '../constants/actionTypes'

const initialState = {
  org: {},
  user: {},
  show: false,
  search: '',
  items: []
}

export default function reducers(state = initialState, action) {
  switch (action.type) {
    case types.SET_USER:
    case types.SET_ORG:
    case types.SHOW_CHANNEL_SEARCH:
    case types.HIDE_CHANNEL_SEARCH:
    case types.INPUT_CHANNEL_SEARCH:
      return {...state, ...action.payload}

    default:
      return state
  }
}
