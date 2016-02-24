import page from 'page'

import * as types from '../constants/actionTypes'
import {reduceChannelUsersToId} from './utils'
import omit from 'lodash/object/omit'
import reduxEmitter from '../redux-emitter'
import * as api from '../backend/api'

import {channelSelector} from '../selectors'

import store from '../app/store'

export function setChannels(channels) {
  return {
    type: types.SET_CHANNELS,
    payload: channels.map(reduceChannelUsersToId)
  }
}

export function setUsers(users) {
  return {
    type: types.SET_USERS,
    payload: users
  }
}

export function setOrg(org) {
  return {
    type: types.SET_ORG,
    payload: {
      org
    }
  }
}

export function setInitialData(org) {
  return dispatch => {
    dispatch(setUsers([...org.users]))
    dispatch(setChannels([...org.channels]))

    const cleanOrg = omit(org, 'users', 'channels', 'rooms', 'pms')
    dispatch(setOrg(cleanOrg))

    return dispatch({
      type: types.INITIAL_DATA_LOADED
    })
  }
}

export function setUser(user) {
  return {
    type: types.SET_USER,
    payload: user
  }
}

export function setChannel(channel) {
  return {
    type: types.SET_CHANNEL,
    payload: {
      channel
    }
  }
}

export function setSettings(settings) {
  return {
    type: types.SET_SETTINGS,
    payload: {
      settings
    }
  }
}

export function setSidebarIsLoading(isLoading) {
  return {
    type: types.SET_SIDEBAR_IS_LOADING,
    payload: {
      isLoading
    }
  }
}

export function goToMessage(message) {
  page(`/chat/${message.slug}/${message.id}`)
  return {
    type: types.GO_TO_MESSAGE,
    payload: {
      message
    }
  }
}

export function goToPayment() {
  location.pathname = '/payment'
  return {
    type: types.GO_TO_PAYMENT
  }
}

export function leaveChannel(channelId) {
  reduxEmitter.leaveChannel(channelId)
  return {
    type: types.LEAVE_CHANNEL
  }
}

export function goToChannel(slug) {
  page(`/chat/${slug}`)
  return {
    type: types.GO_TO_CHANNEL,
    payload: {
      slug
    }
  }
}

export function kickMemberFromChannel(params) {
  reduxEmitter.kickMemberFromChannel(params)
  return {
    type: types.KICK_MEMBER_FROM_CHANNEL
  }
}

export function showOrgInvite() {
  reduxEmitter.showOrgInvite()
  return {
    type: types.SHOW_ORG_INVITE
  }
}

export function enableNotifications() {
  reduxEmitter.enableNotifications()
  // This action don't have reducer yet
  return {
    type: types.ENABLE_NOTIFICATIONS
  }
}

export function error(err) {
  reduxEmitter.showError(err)
  // This action don't have reducer yet
  return {
    type: types.HANDLE_ERROR,
    payload: error
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

// This action isn't used yet, remove this comment after first use
/**
 * Run api request to join channel
 * response is handled at app/subscribe.js with action handleJoinedChannel
 */
export function joinChannel({id} = channelSelector(store.getState())) {
  return dispatch => {
    return api
      .joinChannel(id)
      .catch(err => dispatch(error(err)))
  }
}

// This action isn't used yet, remove this comment after first use
export function inviteToChannel(
  usernames,
  {id} = channelSelector(store.getState())
) {
  return dispatch => {
    return api
      .inviteToChannel(usernames, id)
      .then(() => dispatch(invitedToChannel(usernames, id)))
      .catch(err => dispatch(error(err)))
  }
}

export function showChannelsManager() {
  reduxEmitter.showChannelsManager()
  return {
    type: types.SHOW_CHANNELS_MANAGER
  }
}

export function showPMsManager() {
  reduxEmitter.showPMsManager()
  return {
    type: types.SHOW_PMS_MANAGER
  }
}

export function toggleOrgSettings(elem) {
  reduxEmitter.toggleOrgSettings(elem)
  return {
    type: types.TOGGLE_ORG_SETTINGS
  }
}
