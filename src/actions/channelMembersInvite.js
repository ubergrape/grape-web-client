import * as types from '../constants/actionTypes'
import page from 'page'
import {colors, icons} from 'grape-theme/dist/room-settings'
import sample from 'lodash/collection/sample'

import * as api from '../utils/backend/api'
import {roomNameFromUsers} from './utils'
import {channelSelector, orgSelector} from '../selectors'
import {goToChannel, error, invitedToChannel} from './common'


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

export function createRoomFromPmAndInvite(users) {
  return (dispatch, getState) => {
    const {id} = orgSelector(getState())
    const channel = channelSelector(getState())
    const newChannelUsers = [...channel.users, ...users]
    const emailAddresses = newChannelUsers.map(({email}) => email)

    const room = {
      name: roomNameFromUsers(newChannelUsers),
      color: sample(colors),
      icon: sample(icons),
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
        if (newRoom) return api.inviteToChannel(emailAddresses, newRoom.id)
      })
      .then(() => {
        if (newRoom) {
          page(`/chat/${newRoom.slug}`)
          dispatch(invitedToChannel(emailAddresses, newRoom.id))
        }
      })
      .catch(err => dispatch(error(err)))
  }
}
