import page from 'page'
import parseUrl from 'grape-web/lib/parse-url'
import omit from 'lodash/object/omit'

import conf from '../conf'
import * as types from '../constants/actionTypes'
import {
  normalizeChannelData,
  removeBrokenPms,
  roomNameFromUsers
} from './utils'
import reduxEmitter from '../legacy/redux-emitter'
import * as api from '../utils/backend/api'
import {type as connection} from '../utils/backend/client'
import {channelSelector, userSelector} from '../selectors'

export function error(err) {
  console.error(err.stack) // eslint-disable-line no-console
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

export function setInitialData(org) {
  return (dispatch) => {
    dispatch(setUsers([...org.users]))
    dispatch(setChannels([...org.channels]))

    const cleanOrg = omit(org, 'users', 'channels', 'rooms', 'pms')
    dispatch(setOrg(cleanOrg))
    setTimeout(() => {
      dispatch(showTutorial({via: 'onboarding'}))
    }, 1000)
    dispatch({type: types.HANDLE_INITIAL_DATA})
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
      channel,
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
    dispatch({
      type: types.GO_TO_MESSAGE,
      payload: message
    })
    page(parseUrl(message.link).pathname)
  }
}

// TODO use goTo action creator
export function goToPayment() {
  return (dispatch) => {
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
  return (dispatch) => {
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

export function enableNotifications() {
  reduxEmitter.enableNotifications()
  // This action don't have reducer yet
  return {
    type: types.ENABLE_NOTIFICATIONS
  }
}

export function handleNotification(notification) {
  return {
    type: types.HANDLE_NOTIFICATION,
    payload: notification
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

// TODO use goTo action creator
function handleAuthError(err) {
  return (dispatch) => {
    dispatch({
      type: types.AUTH_ERROR,
      payload: err
    })
    location.href = conf.server.loginPath
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

// TODO use goTo action creator
export function goToAddIntegrations() {
  return (dispatch) => {
    dispatch({
      type: types.GO_TO_ADD_INTEGRATIONS
    })
    location.pathname = '/integrations'
  }
}

export function focusGrapeInput() {
  return (dispatch) => {
    dispatch({
      type: types.FOCUS_GRAPE_INPUT
    })
    reduxEmitter.focusGrapeInput()
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

export function goTo(options) {
  const {path, url, target} = options
  return (dispatch) => {
    dispatch({
      type: types.SET_LOCATION,
      payload: options
    })
    if (path) location.pathname = path
    if (url) window.open(url, target)
  }
}
