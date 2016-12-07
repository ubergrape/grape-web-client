import * as types from '../constants/actionTypes'

export function showManageGroups() {
  return {
    type: types.SHOW_MANAGE_GROUPS
  }
}

export function hideManageGroups() {
  return {
    type: types.HIDE_MANAGE_GROUPS
  }
}

export function setManageGroupsFilter(filter) {
  return {
    type: types.SET_MANAGE_GROUPS_FILTER,
    payload: {
      filter
    }
  }
}
