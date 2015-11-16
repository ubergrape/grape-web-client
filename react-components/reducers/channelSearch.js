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
    case types.CHANNEL_SEARCH_SHOW:
    case types.CHANNEL_SEARCH_HIDE:
    case types.CHANNEL_SEARCH_INPUT:
      return {...state, ...action.payload}

    default:
      return state
  }
}
