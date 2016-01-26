import * as types from '../constants/actionTypes'

export function showInviteChannelMemberList() {
  return {
    type: types.SHOW_INVITE_CHANNEL_MEMBER_LIST
  }
}

export function hideInviteChannelMemberList() {
  return {
    type: types.HIDE_INVITE_CHANNEL_MEMBER_LIST
  }
}

export function addToInviteChannelMemberList(user) {
  return {
    type: types.ADD_TO_INVITE_CHANNEL_MEMBER_LIST,
    payload: user
  }
}

export function removeFromInviteChannelMemberList(user) {
  return {
    type: types.REMOVE_FROM_INVITE_CHANNEL_MEMBER_LIST,
    payload: user
  }
}

export function setInviteFilterValue(value) {
  return {
    type: types.FILTER_INVITE_CHANNEL_MEMBER_LIST,
    payload: value
  }
}
