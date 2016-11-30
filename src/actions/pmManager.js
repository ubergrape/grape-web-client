import * as types from '../constants/actionTypes'

export function showPmManager() {
  return {
    type: types.SHOW_PM_MANAGER
  }
}

export function hidePmManager() {
  return {
    type: types.HIDE_PM_MANAGER
  }
}

export function setPmManagerFilter(filter) {
  return {
    type: types.SET_PM_MANAGER_FILTER,
    payload: {
      filter
    }
  }
}
