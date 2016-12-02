import * as types from '../constants/actionTypes'

export function showManageContacts() {
  return {
    type: types.SHOW_MANAGE_CONTACTS
  }
}

export function hideManageContacts() {
  return {
    type: types.HIDE_MANAGE_CONTACTS
  }
}

export function setManageContactsFilter(filter) {
  return {
    type: types.SET_MANAGE_CONTACTS_FILTER,
    payload: {
      filter
    }
  }
}
