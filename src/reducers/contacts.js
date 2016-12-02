import {combineReducers} from 'redux'
import * as types from '../constants/actionTypes'
import {ACTIVE_CONTACT} from '../constants/contacts'

export function dialog(state = false, action) {
  switch (action.type) {
    case types.SHOW_CONTACTS:
      return true
    case types.HIDE_CONTACTS:
      return false
    default:
      return state
  }
}

export function activeFilter(state = ACTIVE_CONTACT, action) {
  switch (action.type) {
    case types.SET_CONTACTS_FILTER:
      const {filter} = action.payload
      return filter
    default:
      return state
  }
}

export default combineReducers({
  show: dialog,
  activeFilter
})
