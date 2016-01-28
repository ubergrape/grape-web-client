import * as types from '../constants/actionTypes'

const initialState = {
  org: {
    users: [],
    rooms: []
  },
  user: {},
  show: false,
  search: '',
  items: []
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case types.SET_USER:
    case types.SET_ORG:
    case types.SHOW_CHANNEL_SEARCH:
    case types.HIDE_CHANNEL_SEARCH:
    case types.INPUT_CHANNEL_SEARCH:
    case types.FOCUS_CHANNEL_SEARCH_ITEM:
      return {...state, ...action.payload}
    default:
      return state
  }
}
