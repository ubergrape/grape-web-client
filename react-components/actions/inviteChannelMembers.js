import * as types from '../constants/actionTypes'
import {maxChannelNameLength} from '../constants/app'

import store from '../app/store'
import {goToChannel, error, invitedToChannel} from './common'
import page from 'page'
import {channelSelector, orgSelector} from '../selectors'
import * as api from '../backend/api'


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

export function createRoomAndInvite(users) {
  const currentOrg = orgSelector(store.getState())
  const currentChannel = channelSelector(store.getState())
  const newChannelUsers = [...currentChannel.users, ...users]
  const usernames = newChannelUsers.map(user => user.username)

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

    let newRoom
    return api
      .createRoom(room)
      .then((_newRoom) => {
        newRoom = _newRoom
        return api.joinToChannel(newRoom.id)
      })
      .catch(err => {
        const {details} = err
        if (details && details.error === 'SlugAlreadyExist') {
          return dispatch(goToChannel(details.slug))
        }
      })
      .then(() => {
        if (newRoom) return api.inviteToChannel(usernames, newRoom.id)
      })
      .then(() => {
        if (newRoom) {
          page(`/chat/${newRoom.slug}`)
          return dispatch(invitedToChannel(usernames, newRoom.id))
        }
      })
      .catch(err => dispatch(error(err)))
  }
}
