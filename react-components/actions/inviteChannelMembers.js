import * as types from '../constants/actionTypes'
import {maxChannelNameLength} from '../constants/app'

import store from '../app/store'
import {goToChannel, error} from './common'
import rpc from '../backend/rpc'
import page from 'page'
import {channelSelector, orgSelector} from '../selectors'
import * as api from '../app/api'


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
    return api.joinToChannel(
      id,
      () => {
        if (callback) return dispatch(callback())
        return {type: types.NOOP}
      },
      err => dispatch(error(err))
    )
  }
}

export function inviteToChannel(
  usernames,
  {id} = channelSelector(store.getState()),
  callback
) {
  return dispatch => {
    return api.inviteToChannel(
      usernames,
      id,
      () => {
        if (callback) callback()
        return dispatch(invitedToChannel(usernames, id))
      },
      err => dispatch(error(err))
    )
  }
}

export function createRoomAndInvite(users) {
  const currentOrg = orgSelector(store.getState())
  const currentChannel = channelSelector(store.getState())
  const newChannelUsers = [...currentChannel.users, ...users]

  function onChannelJoined(newRoom) {
    return inviteToChannel(
      newChannelUsers.map(user => user.username),
      newRoom,
      () => { page(`/chat/${newRoom.slug}`)}
    )
  }

  function onRoomCreated(newRoom) {
    return joinToChannel(
      newRoom,
      onChannelJoined.bind(null, newRoom)
    )
  }

  return dispatch => {
    const name = newChannelUsers
      .map(user => user.displayName)
      .join(', ')
      .slice(0, maxChannelNameLength - 1)

    const room = {
      name,
      is_public: false,
      organization: currentOrg.id
    }

    return api.createRoom(
      room,
      newRoom => {
        return dispatch(onRoomCreated(newRoom))
      },
      err => {
        const {details} = err
        if (details && details.error === 'SlugAlreadyExist') {
          return dispatch(goToChannel(details.slug))
        }
        return dispatch(error(err))
      }
    )
  }
}
