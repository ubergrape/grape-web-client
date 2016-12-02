import * as types from '../constants/actionTypes'

export function showContactsDialog() {
  return {
    type: types.SHOW_CONTACTS
  }
}

export function hideContactsDialog() {
  return {
    type: types.HIDE_CONTACTS
  }
}

export function setContactsFilter(filter) {
  return {
    type: types.SET_CONTACTS_FILTER,
    payload: {
      filter
    }
  }
}
