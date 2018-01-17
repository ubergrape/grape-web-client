import * as types from '../constants/actionTypes'

export function showChannelMembersInvite() {
  return {
    type: types.SHOW_CHANNEL_MEMBERS_INVITE
  }
}

export function hideChannelMembersInvite() {
  return {
    type: types.HIDE_CHANNEL_MEMBERS_INVITE
  }
}

export function addToChannelMembersInvite(user) {
  return {
    type: types.ADD_TO_CHANNEL_MEMBERS_INVITE,
    payload: user
  }
}

export function removeFromChannelMembersInvite(user) {
  return {
    type: types.REMOVE_FROM_CHANNEL_MEMBERS_INVITE,
    payload: user
  }
}

export function setInviteFilterValue(value) {
  return {
    type: types.FILTER_CHANNEL_MEMBERS_INVITE,
    payload: value
  }
}
