import page from 'page'
import parseUrl from 'grape-web/lib/parse-url'
import omit from 'lodash/object/omit'
import find from 'lodash/collection/find'

import conf from '../conf'
import * as types from '../constants/actionTypes'
import reduxEmitter from '../legacy/redux-emitter'
import {channelsSelector, usersSelector} from '../selectors'
import {
  normalizeChannelData,
  normalizeUserData,
  removeBrokenPms
} from './utils'
import {
  ensureBrowserNotificationPermission,
  showToastNotification
} from './'

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

export function goTo(options) {
  return (dispatch) => {
    dispatch({
      type: types.GO_TO,
      payload: options
    })
    const {path, url, target} = options
    // If it is a URL and not a path, always open in a new window.
    if (url) {
      if (target) window.open(url, target)
      else location.href = url
    } else if (path) {
      if (conf.embed) {
        // In the embdeded chat we open all URLs in a new window.
        window.open(`${conf.server.protocol}//${conf.server.host}${path}`, '_blank')
      // All /chat URLs are handled by the router.
      } else if (path.substr(0, 5) === '/chat') page(path)
      // Locations outside of SPA.
      else location.pathname = path
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

export function goToMessage(message) {
  return (dispatch) => {
    if (!conf.embed) {
      dispatch({
        type: types.GO_TO_MESSAGE,
        payload: message
      })
    }
    dispatch(goTo({path: parseUrl(message.link).pathname}))
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
    dispatch(goTo({path: `/chat/${slug}`}))
  }
}

export function goToPayment() {
  return (dispatch) => {
    dispatch({type: types.GO_TO_PAYMENT})
    dispatch(goTo({path: '/payment'}))
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

export function goToAddIntegrations() {
  return (dispatch) => {
    dispatch({type: types.GO_TO_ADD_INTEGRATIONS})
    dispatch(goTo({path: '/integrations'}))
  }
}

export function setInitialData(org) {
  return (dispatch, getState) => {
    dispatch(setUsers([...org.users]))
    dispatch(setChannels([...org.channels]))

    const cleanOrg = omit(org, 'users', 'channels', 'rooms', 'pms')
    dispatch(setOrg(cleanOrg))
    dispatch(ensureBrowserNotificationPermission())
    // Used by embedded chat.
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
