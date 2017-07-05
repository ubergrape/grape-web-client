import page from 'page'
import parseUrl from 'grape-web/lib/parse-url'
import omit from 'lodash/object/omit'
import find from 'lodash/collection/find'

import conf from '../conf'
import * as types from '../constants/actionTypes'
import reduxEmitter from '../legacy/redux-emitter'
import * as api from '../utils/backend/api'
import {type as connection} from '../utils/backend/client'
import {channelSelector, channelsSelector, userSelector, usersSelector} from '../selectors'
import {ensureBrowserNotificationPermission} from './browserNotification'
import {showToastNotification} from './toastNotification'
import {
  normalizeChannelData,
  normalizeUserData,
  removeBrokenPms,
  roomNameFromUsers
} from './utils'

export function error(err) {
  return (dispatch) => {
    dispatch({
      type: types.HANDLE_ERROR,
      payload: error
    })
    dispatch(showToastNotification(err.message))
    // eslint-disable-next-line no-console
    console.error(err.stack)
  }
}

// Use it for ALL location changes outside of the /chat.
export function goTo(options) {
  return (dispatch) => {
    dispatch({
      type: types.GO_TO,
      payload: options
    })
    const {path, url, target} = options
    if (url) window.open(url, target)
    else if (path) {
      if (conf.embed) {
        window.open(`${conf.server.protocol}//${conf.server.host}${path}`, '_blank')
      } else location.pathname = path
    }
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
    payload: users.map(normalizeUserData)
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

export function trackAnalytics(name, options) {
  return (dispatch) => {
    dispatch({
      type: types.TRACK_ANALYTICS,
      payload: {name, options}
    })
    if (window.analytics) window.analytics.track(name, options)
  }
}

export function showTutorial(options) {
  return (dispatch) => {
    dispatch({type: types.SHOW_TUTORIAL})
    // FIXME: this should be deleted when Intro.js would be refactored
    // https://github.com/ubergrape/chatgrape/issues/4056
    reduxEmitter.showIntro(options)
    dispatch(trackAnalytics('Started Tutorial', options))
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

export function setChannel(channel, messageId) {
  return {
    type: types.SET_CHANNEL,
    payload: {
      channel: normalizeChannelData(channel),
      messageId
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
  return (dispatch) => {
    if (!conf.embed) {
      dispatch({
        type: types.GO_TO_MESSAGE,
        payload: message
      })
    }
    page(parseUrl(message.link).pathname)
  }
}

export function goToChannel(slug) {
  return (dispatch) => {
    if (!conf.embed) {
      dispatch({
        type: types.GO_TO_CHANNEL,
        payload: slug
      })
    }
    page(`/chat/${slug}`)
  }
}

export function goToPayment() {
  return (dispatch) => {
    dispatch({type: types.GO_TO_PAYMENT})
    dispatch(goTo({path: '/payment'}))
  }
}

export function leaveChannel(channelId) {
  reduxEmitter.leaveChannel(channelId)
  return {
    type: types.LEAVE_CHANNEL
  }
}

export function kickMemberFromChannel(params) {
  reduxEmitter.kickMemberFromChannel(params)
  return {
    type: types.KICK_MEMBER_FROM_CHANNEL
  }
}

export function handleNotification(notification) {
  return (dispatch, getState) => {
    const state = getState()
    const channels = channelsSelector(state)
    const users = usersSelector(state)
    dispatch({
      type: types.HANDLE_NOTIFICATION,
      payload: {
        ...notification,
        channel: find(channels, {id: notification.channelId}),
        inviter: find(users, {id: notification.inviterId})
      }
    })
  }
}

export function invitedToChannel(emailAddresses, channelId) {
  return {
    type: types.INVITED_TO_CHANNEL,
    payload: {
      emailAddresses,
      channelId
    }
  }
}

// This action isn't used yet, remove this comment after first use
/**
 * Run api request to join channel
 * response is handled at app/subscribe.js with action handleJoinedChannel
 */
export function joinChannel(options = {}) {
  return (dispatch, getState) => {
    const id = options.id || channelSelector(getState()).id

    return api
      .joinChannel(id)
      .catch(err => dispatch(error(err)))
  }
}

export function inviteToChannel(emailAddresses, options = {}) {
  return (dispatch, getState) => {
    const id = options.id || channelSelector(getState()).id
    return api
      .inviteToChannel(emailAddresses, id)
      .then(() => dispatch(invitedToChannel(emailAddresses, id)))
      .catch(err => dispatch(error(err)))
  }
}

function handleAuthError(err) {
  return (dispatch) => {
    dispatch({
      type: types.AUTH_ERROR,
      payload: err
    })
    dispatch(goTo({path: '/accounts/login'}))
  }
}

export function handleConnectionError(err) {
  return (dispatch) => {
    dispatch({
      type: types.CONNECTION_ERROR,
      payload: err
    })

    if (connection === 'ws') {
      api
        .checkAuth()
        .catch((authErr) => {
          if (authErr.status === 401) {
            dispatch(handleAuthError(authErr))
          }
        })
      return
    }

    if (err.status === 401) {
      dispatch(handleAuthError(err))
    }
  }
}

export function goToAddIntegrations() {
  return (dispatch) => {
    dispatch({type: types.GO_TO_ADD_INTEGRATIONS})
    dispatch(goTo({path: '/integrations'}))
  }
}

export function requestRoomCreate() {
  return {
    type: types.REQUEST_ROOM_CREATE
  }
}

export function handleRoomCreateError(message) {
  return {
    type: types.HANDLE_ROOM_CREATE_ERROR,
    payload: message
  }
}

export function clearRoomCreateError() {
  return {
    type: types.CLEAR_ROOM_CREATE_ERROR
  }
}

export function createRoomWithUsers(room, users) {
  return (dispatch, getState) => {
    dispatch(requestRoomCreate())

    const user = userSelector(getState())
    const emailAddresses = users.map(({email}) => email)
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
      .then(() => (newRoom ? api.inviteToChannel(emailAddresses, newRoom.id) : null))
      .then(() => {
        if (newRoom) {
          page(`/chat/${newRoom.slug}`)
          dispatch(invitedToChannel(emailAddresses, newRoom.id))
        }
      })
      .catch((err) => {
        dispatch(handleRoomCreateError(err.message))
      })
  }
}

export function setInitialData(org) {
  return (dispatch, getState) => {
    dispatch(setUsers([...org.users]))
    dispatch(setChannels([...org.channels]))

    const cleanOrg = omit(org, 'users', 'channels', 'rooms', 'pms')
    dispatch(setOrg(cleanOrg))
    dispatch(ensureBrowserNotificationPermission())
    if (conf.channelId) {
      const channels = channelsSelector(getState())
      const channel = find(channels, {id: conf.channelId})
      dispatch(setChannel(channel))
    }
    setTimeout(() => {
      dispatch(showTutorial({via: 'onboarding'}))
    }, 1000)
    dispatch({type: types.HANDLE_INITIAL_DATA})
  }
}
