import * as types from '../constants/actionTypes'
import rpc from '../backend/rpc'
import {channelSelector} from '../selectors'
import reduxEmitter from '../redux-emitter'

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

export function invitedToCurrentChannel(users) {
  return {
    type: types.INVITED_TO_CURRENT_CHANNEL,
    payload: users
  }
}

export function inviteToCurrentChannel(usernames) {
  return (dispatch, getState) => {
    const channel = channelSelector(getState())
    rpc(
      {
        ns: 'channels',
        action: 'invite',
        args: [channel.id, usernames]
      },
      {camelize: true},
      (err) => {
        if (err) reduxEmitter.showError(err)
        // the responce is being listned at `app/subscribe`
        // this dispatched action is probably don't have a reducer
        dispatch(invitedToCurrentChannel(usernames))
      }
    )
  }
}
