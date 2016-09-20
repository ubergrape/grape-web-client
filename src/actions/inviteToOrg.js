import * as types from '../constants/actionTypes'

export function showInviteToOrg() {
  return {
    type: types.SHOW_INVITE_TO_ORG
  }
}

export function hideInviteToOrg() {
  return {
    type: types.HIDE_INVITE_TO_ORG
  }
}
