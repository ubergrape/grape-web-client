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
    case types.ON_USER_SETTED:
      return {...state, ...action.payload}

    case types.ON_ORG_READY:
      return {...state, ...action.payload}

    case types.CHANNEL_SEARCH_SHOW:
      return {...state, ...action.payload}

    case types.CHANNEL_SEARCH_HIDE:
      return {...state, ...action.payload}

    case types.CHANNEL_SEARCH_INPUT:
      return {...state, ...action.payload}

    default:
      return state
  }
}
