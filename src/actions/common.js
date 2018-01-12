import parseUrl from 'grape-web/lib/parse-url'
import omit from 'lodash/object/omit'
import find from 'lodash/collection/find'
import * as router from 'react-router-redux'

import conf from '../conf'
import * as types from '../constants/actionTypes'
import {
  channelsSelector, channelSelector, usersSelector, userSelector, pmsSelector,
  appSelector
} from '../selectors'
import * as api from '../utils/backend/api'
import {
  normalizeChannelData,
  normalizeUserData,
  removeBrokenPms,
  findLastUsedChannel
} from './utils'
import {
  ensureBrowserNotificationPermission,
  showToastNotification,
  showIntro,
  showAlert
} from './'
import * as alerts from '../constants/alerts'

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
      return
    }

    // In the embdeded chat we open all URLs in a new window.
    if (path && conf.embed) {
      window.open(`${conf.server.serviceUrl}${path}`, '_blank')
      return
    }

    // All /chat URLs are handled by the router.
    if (path.substr(0, 5) === '/chat') {
      if (options.replace) dispatch(router.replace(path))
      else dispatch(router.push(path))
      return
    }

    // Locations outside of SPA open with full page reload.
    location.pathname = path
  }
}

export const setChannels = channels => (dispatch, getState) => {
  const user = userSelector(getState())

  dispatch({
    type: types.SET_CHANNELS,
    payload: channels
      .filter(removeBrokenPms)
      .map(channel => normalizeChannelData(channel, user.id))
  })
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

export const handleUserProfile = profile => (dispatch) => {
  const {settings, organizations, ...user} = profile

  dispatch({
    type: types.SET_USER,
    payload: normalizeUserData(user, organizations)
  })

  dispatch({
    type: types.SET_SETTINGS,
    payload: settings
  })

  dispatch({
    type: types.SET_ORGANIZATIONS,
    payload: organizations
  })

  if (settings.showIntro) {
    dispatch(showIntro({via: 'onboarding'}))
  }
}

export const setChannel = (channelId, messageId) => (dispatch, getState) => {
  const state = getState()
  let nextChannel = channelId

  if (typeof channelId === 'number') {
    const channels = channelsSelector(state)
    nextChannel = find(channels, {id: channelId})
  }

  if (!nextChannel) return

  const currChannel = channelSelector(state)

  // Has not changed.
  if (currChannel && currChannel.id === nextChannel.id) {
    return
  }

  dispatch({
    type: types.SET_CHANNEL,
    payload: {channel: normalizeChannelData(nextChannel), messageId}
  })
}

export const goToLastUsedChannel = () => (dispatch, getState) => {
  const channels = channelsSelector(getState())
  const channel = findLastUsedChannel(channels)
  dispatch(goTo({path: `/chat/${channel.id}`}))
}

export const handleChannelNotFound = () => (dispatch) => {
  dispatch(goToLastUsedChannel())
  dispatch(showAlert({
    level: 'warning',
    type: alerts.CHANNEL_NOT_FOUND,
    closeAfter: 6000,
    isClosable: true
  }))
}

export function goToMessage(message) {
  return (dispatch) => {
    dispatch({
      type: types.GO_TO_MESSAGE,
      payload: message
    })
    dispatch(goTo({path: parseUrl(message.link).pathname}))
  }
}

export function goToChannel(channelId, options) {
  return (dispatch) => {
    dispatch({
      type: types.GO_TO_CHANNEL,
      payload: channelId
    })
    dispatch(goTo({...options, path: `/chat/${channelId}`}))
    dispatch(setChannel(channelId))
  }
}

export const goToPmChannel = (mateId, options) => (dispatch, getState) => {
  const channels = pmsSelector(getState())
  const channel = find(channels, ({mate}) => mate.id === mateId)
  if (channel) dispatch(goToChannel(channel.id, options))
  else dispatch(handleChannelNotFound())
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

export const handleChangeRoute = ({name, params}) => (dispatch, getState) => {
  dispatch({
    type: types.HANDLE_CHANGE_ROUTE,
    payload: {name, params}
  })

  switch (name) {
    case 'pm': {
      dispatch(goToPmChannel(params.mateId, {replace: true}))
      break
    }
    case 'channel': {
      const channels = channelsSelector(getState())
      const channel = find(channels, {id: params.channelId})
      if (channel) dispatch(setChannel(params.channelId, params.messageId))
      else dispatch(handleChannelNotFound())
      break
    }
    default:
      dispatch(goToLastUsedChannel())
  }
}

export const loadInitialData = clientId => (dispatch, getState) => {
  dispatch({
    type: types.SET_INITIAL_DATA_LOADING,
    payload: true
  })
  dispatch({type: types.REQUEST_ORG_DATA})
  dispatch({type: types.REQUEST_USER_PROFILE})
  dispatch({type: types.REQUEST_USERS})
  dispatch({type: types.REQUEST_JOIN_ORG})
  Promise.all([
    api.getOrg(conf.organization.id),
    api.getUsers({orgId: conf.organization.id}),
    api.getUserProfile(),
    api.joinOrg(conf.organization.id, clientId)
  ]).then(([org, users, profile]) => {
    dispatch(setUsers(users))
    dispatch(handleUserProfile(profile))
    dispatch(setChannels(org.channels))
    dispatch(setOrg(omit(org, 'users', 'channels', 'rooms', 'pms')))
    dispatch(ensureBrowserNotificationPermission())

    // In embedded chat conf.channelId is defined.
    const channel = conf.channelId || findLastUsedChannel(channelsSelector(getState()))

    dispatch(setChannel(channel))

    dispatch({
      type: types.SET_INITIAL_DATA_LOADING,
      payload: false
    })

    // On initial load route has changed, but data was not loaded,
    // so we need to trigger it here again.
    const {route} = appSelector(getState())
    if (route) {
      dispatch(handleChangeRoute(route))
    }
  })
  .catch((err) => {
    dispatch(error(err))
  })
}
