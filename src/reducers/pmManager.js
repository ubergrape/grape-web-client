import {combineReducers} from 'redux'
import * as types from '../constants/actionTypes'
import {ACTIVE_PM} from '../constants/pmManager'

export function dialog(state = false, action) {
  switch (action.type) {
    case types.SHOW_PM_MANAGER:
      return true
    case types.HIDE_PM_MANAGER:
      return false
    default:
      return state
  }
}

export function activeFilter(state = ACTIVE_PM, action) {
  switch (action.type) {
    case types.SET_PM_MANAGER_FILTER:
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
