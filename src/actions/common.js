import omit from 'lodash/omit'
import find from 'lodash/find'
import moment from 'moment-timezone'

import conf from '../conf'
import * as types from '../constants/actionTypes'
import { reopen } from '../app/client'
import {
  channelsSelector,
  userSelector,
  joinedRoomsSelector,
  pmsSelector,
  orgSelector,
  appSelector,
} from '../selectors'
import * as api from '../utils/backend/api'
import * as alerts from '../constants/alerts'
import {
  normalizeChannelData,
  normalizeUserData,
  removeBrokenPms,
  findLastUsedChannel,
} from './utils'
import {
  ensureBrowserNotificationPermission,
  showToastNotification,
  showIntro,
  showAlert,
  goToLastUsedChannel,
  addChannel,
  handleRoomCreateError,
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

export const setChannels = channels => (dispatch, getState) => {
  const user = userSelector(getState())

  const payload = channels
    .filter(removeBrokenPms)
    .map(channel => normalizeChannelData(channel, user.id))

  dispatch({
    type: types.SET_CHANNELS,
    payload,
  })
}

export const setUsers = users => dispatch => {
  dispatch({
    type: types.SET_USERS,
    payload: users.map(normalizeUserData),
  })
}

export const addUser = user => dispatch => {
  dispatch({
    type: types.ADD_USER_TO_ORG,
    payload: normalizeUserData(user),
  })
}

export const addNewUser = userId => (dispatch, getState) => {
  const org = orgSelector(getState())

  return api
    .openPm(org.id, userId)
    .then(({ id, users }) => Promise.all([users, api.getChannel(id)]))
    .then(([users, pmChannel]) => {
      dispatch(addUser(pmChannel))
      dispatch(
        addChannel({
          ...pmChannel,
          users,
        }),
      )
    })
    .catch(err => {
      dispatch(handleRoomCreateError(err.message))
    })
}

export const updateUserPartnerInfo = userInfo => dispatch => {
  dispatch({
    type: types.UPDATE_USER_PARTNER_INFO,
    payload: userInfo,
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
  const channel = find(channels, { id: channelId })

  if (!channel) return

  dispatch({
    type: types.SET_CHANNEL,
    payload: {
      channel: normalizeChannelData(channel),
      messageId,
    },
  })
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

export const loadInitialData = clientId => (dispatch, getState) => {
  dispatch({
    type: types.SET_INITIAL_DATA_LOADING,
    payload: true,
  })
  dispatch({ type: types.REQUEST_ORG_DATA })
  dispatch({ type: types.REQUEST_USER_PROFILE })
  dispatch({ type: types.REQUEST_USERS })
  dispatch({ type: types.REQUEST_JOIN_ORG })

  Promise.all([
    api.getOrg(conf.organization.id),
    api.getPmsOverview(conf.organization.id),
    api.getUserProfile(conf.organization.id),
    api.joinOrg(conf.organization.id, clientId),
    api.setProfile({ timezone: moment.tz.guess() }),
  ])
    .then(([org, users, profile]) => {
      dispatch(handleUserProfile(profile))
      dispatch(setChannels(org.channels))
      dispatch(setUsers(users))
      dispatch(setOrg(omit(org, 'users', 'channels', 'rooms', 'pms')))
      dispatch(ensureBrowserNotificationPermission())

      if (
        !joinedRoomsSelector(getState()).length &&
        !pmsSelector(getState()).length
      ) {
        dispatch(
          error(
            new Error(
              'This account has neither joined rooms nor pm channels. This state is currently not supported.',
            ),
          ),
        )
        return
      }

      const { route } = appSelector(getState())
      // A route for the embedded client can be 'undefined', and for the full
      // client the channelId can also be 'undefined' in case no channel is defined
      if (route && route.params.channelId) {
        dispatch(setChannel(route.params.channelId, route.params.messageId))
      } else {
        const channels = channelsSelector(getState())
        const channelToSet = findLastUsedChannel(channels) || channels[0]
        // In embedded chat conf.channelId is defined.
        const channelId = conf.channelId || channelToSet.id
        dispatch(setChannel(channelId))
      }

      dispatch({
        type: types.SET_INITIAL_DATA_LOADING,
        payload: false,
      })
    })
    .catch(err => {
      dispatch(error(err))
      reopen()
    })
}
