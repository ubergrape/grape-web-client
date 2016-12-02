import * as types from '../constants/actionTypes'

const initialState = {
  show: false,
  activeFilter: 'active'
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_MANAGE_CONTACTS:
      return {
        ...state,
        show: true
      }
    case types.HIDE_MANAGE_CONTACTS:
      return {
        ...state,
        show: false
      }
    case types.SET_MANAGE_CONTACTS_FILTER:
      const {filter} = action.payload
      return {
        ...state,
        activeFilter: filter
      }
    default:
      return state
  }
}
