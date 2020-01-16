import omit from 'lodash/omit'
import find from 'lodash/find'
import moment from 'moment-timezone'

import conf from '../conf'
import * as types from '../constants/actionTypes'
import { reopen } from '../app/client'
import {
  appSelector,
  joinedChannelsSelector,
  channelsSelector,
  channelSelector,
} from '../selectors'
import * as api from '../utils/backend/api'
import * as alerts from '../constants/alerts'
import {
  normalizeChannelData,
  normalizeUserData,
  findLastUsedChannel,
} from './utils'
import {
  ensureBrowserNotificationPermission,
  showToastNotification,
  showIntro,
  showAlert,
  addChannel,
  goToLastUsedChannel,
  showNewConversation,
  hideBrowser,
} from './'

export function error(err) {
  return dispatch => {
    dispatch({
      type: types.HANDLE_ERROR,
      payload: error,
    })
    dispatch(showToastNotification(err.message))
    // eslint-disable-next-line no-console
    console.error(err.stack)
  }
}

export const setChannels = channels => dispatch => {
  const payload = channels.map(channel => normalizeChannelData(channel))

  dispatch({
    type: types.SET_CHANNELS,
    payload,
  })
}

export function setOrg(org) {
  return {
    type: types.SET_ORG,
    payload: {
      org,
    },
  }
}

export function trackAnalytics(name, options) {
  return dispatch => {
    dispatch({
      type: types.TRACK_ANALYTICS,
      payload: { name, options },
    })
    if (window.analytics) window.analytics.track(name, options)
  }
}

export const handleUserProfile = profile => dispatch => {
  const { settings, organizations, ...user } = profile

  dispatch({
    type: types.SET_USER,
    payload: normalizeUserData(user, organizations),
  })

  dispatch({
    type: types.SET_SETTINGS,
    payload: settings,
  })

  dispatch({
    type: types.SET_ORGANIZATIONS,
    payload: organizations,
  })

  if (settings.showIntro) {
    dispatch(showIntro({ via: 'onboarding' }))
  }
}

export const setChannel = (channelId, messageId) => (dispatch, getState) => {
  const channels = channelsSelector(getState())

  dispatch(hideBrowser())

  api
    .getChannel(channelId)
    .then(channel => {
      if (!find(channels, { id: channelId })) dispatch(addChannel(channel))

      const currentChannel = channelSelector(getState())

      dispatch({
        type: types.SET_CHANNEL,
        payload: {
          channel,
          currentChannel,
          messageId,
        },
      })
    })
    .catch(err => dispatch(error(err)))
}

export const handleBadChannel = alertType => dispatch => {
  dispatch(goToLastUsedChannel())
  dispatch(
    showAlert({
      level: 'warning',
      type: alertType || alerts.CHANNEL_NOT_FOUND,
      closeAfter: 6000,
      isClosable: true,
    }),
  )
}

export const setIntialDataLoading = payload => dispatch => {
  dispatch({
    type: types.SET_INITIAL_DATA_LOADING,
    payload,
  })
}

export const setConf = payload => dispatch => {
  dispatch({
    type: types.SET_CONF,
    payload,
  })
}

export const loadInitialData = clientId => (dispatch, getState) => {
  dispatch(setIntialDataLoading(true))

  dispatch({ type: types.REQUEST_ORG_DATA })
  dispatch({ type: types.REQUEST_USER_PROFILE })
  dispatch({ type: types.REQUEST_USERS })
  dispatch({ type: types.REQUEST_JOIN_ORG })

  Promise.all([
    api.getOrg(conf.organization.id),
    api.getOverview(conf.organization.id, { limit: 50 }),
    api.getPinnedOverview(conf.organization.id),
    api.getUserProfile(conf.organization.id),
    api.loadLabelsConfig(conf.organization.id),
    api.joinOrg(conf.organization.id, clientId),
    api.setProfile({ timezone: moment.tz.guess() }),
  ])
    .then(([org, channels, pinnedChannels, profile, labelsConfig]) => {
      const allChannels = [...channels, ...pinnedChannels]
      dispatch(handleUserProfile(profile))
      dispatch(setChannels(allChannels))
      dispatch(
        setOrg({
          ...omit(org, 'users', 'channels', 'rooms', 'pms'),
          labelsConfig,
        }),
      )
      dispatch(ensureBrowserNotificationPermission())

      dispatch(setIntialDataLoading(false))

      const { route } = appSelector(getState())
      const isMemberOfAnyRooms = joinedChannelsSelector(getState())

      // A route for the embedded client can be 'undefined', and for the full
      // client the channelId can also be 'undefined' in case no channel is defined
      if (route && route.params.channelId) {
        dispatch(setChannel(route.params.channelId, route.params.messageId))
      } else {
        const channelToSet = findLastUsedChannel(allChannels) || allChannels[0]
        if ((conf.channelId || channelToSet) && isMemberOfAnyRooms) {
          // In embedded chat conf.channelId is defined.
          dispatch(setChannel(conf.channelId || channelToSet.id))
        }
      }

      if (!isMemberOfAnyRooms) {
        dispatch(showNewConversation())
      }
    })
    .catch(err => {
      dispatch(error(err))
      reopen()
    })
}
