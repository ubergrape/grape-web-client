import * as types from '../constants/actionTypes'

import store from '../app/store'
import {goToChannel, error} from './common'
import rpc from '../backend/rpc'
import reduxEmitter from '../redux-emitter'
import page from 'page'
import {channelSelector, orgSelector} from '../selectors'


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

export function invitedToChannel(usernames, channelId) {
  console.log('invitedToChannel', usernames, channelId)
  return {
    type: types.INVITED_TO_CHANNEL,
    payload: {
      usernames,
      channelId
    }
  }
}

export function joinToChannel(
  {id} = channelSelector(store.getState()),
  callback
) {
  return dispatch => {
    rpc({
      ns: 'channels',
      action: 'join',
      args: [id]
    }, err => {
      if (err) return dispatch(error(err))
      // room.joined = true
      if (callback) return dispatch(callback())
      return {type: types.NOOP}
    })
  }
}

export function inviteToChannel(
  usernames,
  {id} = channelSelector(store.getState()),
  callback
) {
  return dispatch => {
    rpc(
      {
        ns: 'channels',
        action: 'invite',
        args: [id, usernames]
      },
      {camelize: true},
      (err) => {
        if (err) return dispatch(error(err))
        // the responce is being listned at `app/subscribe`
        // this dispatched action is probably don't have a reducer
        if (callback) callback()
        return dispatch(invitedToChannel(usernames, id))
      }
    )
  }
}

export function createRoomAndInvite(users) {
  return (dispatch, getState) => {
    const currentOrg = orgSelector(getState())
    const currentChannel = channelSelector(getState())

    const newChannelUsers = [...currentChannel.users, ...users]
    const name = newChannelUsers.map(user => user.displayName).join(', ').slice(0, 49)
    const channel = {
      name,
      is_public: false,
      organization: currentOrg.id
    }

    rpc({
      ns: 'rooms',
      action: 'create',
      args: [channel]
    }, (err, newChannel) => {
      if (err) {
        const {details} = err
        if (details && details.error === 'SlugAlreadyExist') {
          return dispatch(goToChannel(details.slug))
        }
        return dispatch(error(err))
      }
      return dispatch(
        joinToChannel(
          newChannel,
          () => {
            return inviteToChannel(
              newChannelUsers.map(user => user.username),
              newChannel,
              () => { page(`/chat/${newChannel.slug}`)}
            )
          }
        )
      )
    })
  }
}
