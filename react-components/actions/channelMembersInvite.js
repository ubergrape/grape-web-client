import * as types from '../constants/actionTypes'
import {maxChannelNameLength} from '../constants/app'

import store from '../app/store'
import {goToChannel, error, invitedToChannel} from './common'
import page from 'page'
import {channelSelector, orgSelector} from '../selectors'
import * as api from '../backend/api'


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

export function createRoomAndInvite(users) {
  const {id} = orgSelector(store.getState())
  const channel = channelSelector(store.getState())
  const newChannelUsers = [...channel.users, ...users]
  const usernames = newChannelUsers.map(user => user.username)

  return dispatch => {
    const name = newChannelUsers
      .map(user => user.displayName)
      .join(', ')
      .slice(0, maxChannelNameLength - 1)

    const room = {
      name,
      isPublic: false,
      organization: id
    }

    let newRoom
    return api
      .createRoom(room)
      .then((_newRoom) => {
        newRoom = _newRoom
        return api.joinChannel(newRoom.id)
      })
      .catch(err => {
        const {details} = err
        if (details && details.error === 'SlugAlreadyExist') {
          dispatch(goToChannel(details.slug))
        }
      })
      .then(() => {
        if (newRoom) return api.inviteToChannel(usernames, newRoom.id)
      })
      .then(() => {
        if (newRoom) {
          page(`/chat/${newRoom.slug}`)
          dispatch(invitedToChannel(usernames, newRoom.id))
        }
      })
      .catch(err => dispatch(error(err)))
  }
}
