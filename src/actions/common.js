import omit from 'lodash/object/omit'
import find from 'lodash/collection/find'

import conf from '../conf'
import * as types from '../constants/actionTypes'
import {
  channelsSelector, usersSelector, userSelector, appSelector, joinedRoomsSelector,
  pmsSelector
} from '../selectors'
import * as api from '../utils/backend/api'
import * as alerts from '../constants/alerts'
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
  showAlert,
  goToLastUsedChannel,
  handleChangeRoute
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

export const setChannels = (channels, type) => (dispatch, getState) => {
  const user = userSelector(getState())

  const payload = channels
    .filter(removeBrokenPms)
    .map(channel => normalizeChannelData(channel, user.id))
    .map(channel => ({...channel, type}))

  dispatch({
    type: types.SET_CHANNELS,
    payload
  })
}

export const setFavorited = payload => (dispatch) => {
  dispatch({
    type: types.SET_FAVORITED,
    payload
  })
}

export function setUsers(users) {
  return {
    type: types.SET_USERS,
    payload: users.map(normalizeUserData)
  }
}

export const addUser = user => (dispatch) => {
  dispatch({
    type: types.ADD_USER_TO_ORG,
    payload: normalizeUserData(user)
  })
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
  const channels = channelsSelector(getState())
  const channel = find(channels, {id: channelId})

  if (!channel) return

  dispatch({
    type: types.SET_CHANNEL,
    payload: {
      channel: normalizeChannelData(channel),
      messageId
    }
  })
}

export const handleBadChannel = alertType => (dispatch) => {
  dispatch(goToLastUsedChannel())
  dispatch(showAlert({
    level: 'warning',
    type: alertType || alerts.CHANNEL_NOT_FOUND,
    closeAfter: 6000,
    isClosable: true
  }))
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
    api.getPmOverview(conf.organization.id),
    api.getRoomsOverview(conf.organization.id),
    api.getPinnedChannels(conf.organization.id),
    api.getUserProfile(conf.organization.id),
    api.joinOrg(conf.organization.id, clientId)
  ]).then(([org, channels, rooms, favorites, profile]) => {
    dispatch(setChannels(channels, 'pm'))
    dispatch(setChannels(rooms, 'room'))
    dispatch(setFavorited(favorites))
    dispatch(handleUserProfile(profile))
    dispatch(setOrg(omit(org, 'users', 'channels', 'rooms', 'pms')))
    dispatch(ensureBrowserNotificationPermission())

    if (!joinedRoomsSelector(getState()).length && !pmsSelector(getState()).length) {
      dispatch(error(
        new Error('This account has neither joined rooms nor pm channels. This state is currently not supported.')
      ))
      return
    }

    // In embedded chat conf.channelId is defined.
    const channelId = conf.channelId || findLastUsedChannel(channelsSelector(getState())).id

    dispatch(setChannel(channelId))

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
