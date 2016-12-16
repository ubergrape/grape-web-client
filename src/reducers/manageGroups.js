import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  activeFilter: 'joinable'
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_MANAGE_GROUPS:
      return {
        ...state,
        show: true
      }
    case types.HIDE_MANAGE_GROUPS:
      return {
        ...state,
        show: false
      }
    case types.SET_MANAGE_GROUPS_FILTER:
      return {
        ...state,
        activeFilter: action.payload
      }
    default:
      return state
  }
}
