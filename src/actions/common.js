import page from 'page'

import * as types from '../constants/actionTypes'
import {
  normalizeChannelData,
  removeBrokenPms,
  roomNameFromUsers
} from './utils'
import omit from 'lodash/object/omit'
import reduxEmitter from '../legacy/redux-emitter'
import * as api from '../utils/backend/api'
import {type as connection} from '../utils/backend/client'
import {channelSelector} from '../selectors'
import store from '../app/store'

export function error(err) {
  reduxEmitter.showError(err)
  // This action don't have reducer yet
  return {
    type: types.HANDLE_ERROR,
    payload: error
  }
}

export function setChannels(channels) {
  return {
    type: types.SET_CHANNELS,
    payload: channels
      .filter(removeBrokenPms)
      .map(normalizeChannelData)
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
      type: types.HANDLE_INITIAL_DATA
    })
  }
}

export function createChannel(channel) {
  return {
    type: types.CREATE_NEW_CHANNEL,
    payload: {
      ...normalizeChannelData(channel),
      unread: channel.unread || 0
    }
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
  return dispatch => {
    dispatch({
      type: types.GO_TO_MESSAGE,
      payload: message
    })
    page(`/chat/${message.slug}/${message.id}`)
  }
}

export function goToPayment() {
  return dispatch => {
    dispatch({
      type: types.GO_TO_PAYMENT
    })
    location.pathname = '/payment'
  }
}

export function leaveChannel(channelId) {
  reduxEmitter.leaveChannel(channelId)
  return {
    type: types.LEAVE_CHANNEL
  }
}

export function goToChannel(slug) {
  return dispatch => {
    dispatch({
      type: types.GO_TO_CHANNEL,
      payload: slug
    })
    page(`/chat/${slug}`)
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

export function toggleOrgSettings(elem) {
  return dispatch => {
    dispatch({
      type: types.TOGGLE_ORG_SETTINGS
    })
    reduxEmitter.toggleOrgSettings(elem)
  }
}

export function reloadOnAuthError() {
  return dispatch => {
    dispatch({
      type: types.AUTH_ERROR
    })
    location.reload()
  }
}

export function handleConnectionError(err) {
  return dispatch => {
    dispatch({
      type: types.CONNECTION_ERROR,
      payload: err
    })

    if (connection === 'ws') {
      api
        .checkAuth()
        .catch(_err => {
          if (_err.status === 401) dispatch(reloadOnAuthError())
        })
      return
    }

    if (connection === 'lp' && err.status === 401) {
      dispatch(reloadOnAuthError())
    }
  }
}

export function goToAddIntegrations() {
  return dispatch => {
    dispatch({
      type: types.GO_TO_ADD_INTEGRATIONS
    })
    location.pathname = '/integrations'
  }
}

export function focusGrapeInput() {
  return dispatch => {
    dispatch({
      type: types.FOCUS_GRAPE_INPUT
    })
    reduxEmitter.focusGrapeInput()
  }
}

export function createRoomWithUsers(room, users, user) {
  const usernames = users.map(({username}) => username)
  return dispatch => {
    let newRoom
    return api
      .createRoom({
        ...room,
        name: room.name || roomNameFromUsers([user, ...users])
      })
      .then((_newRoom) => {
        newRoom = _newRoom
        return api.joinChannel(newRoom.id)
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
