import omit from 'lodash/omit'
import find from 'lodash/find'
import moment from 'moment-timezone'

import conf from '../conf'
import * as types from '../constants/actionTypes'
import { reopen } from '../app/client'
import {
  channelsSelector,
  userSelector,
  appSelector,
  joinedChannelsSelector,
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
  onShowNewConversation,
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

export const addNewChannel = id => (dispatch, getState) => {
  const user = userSelector(getState())

  return api
    .getChannel(id)
    .then(channel => {
      if (channel.type === 'room') {
        dispatch(
          addChannel({
            ...channel,
            users: [id, user.id],
          }),
        )
        return
      }
      dispatch(addUser(channel))
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

export const setChannel = (channelOrChannelId, messageId) => (
  dispatch,
  getState,
) => {
  const channels = channelsSelector(getState())
  let channel
  if (typeof channelOrChannelId === 'number') {
    channel = find(channels, { id: channelOrChannelId })
  } else {
    channel = channelOrChannelId
  }

  if (!channel) return

  dispatch(hideBrowser())

  api.getChannel(channel.id).then(({ permissions, videoconferenceUrl }) => {
    dispatch({
      type: types.SET_CHANNEL,
      payload: {
        channel: {
          ...normalizeChannelData(channel),
          permissions,
          videoconferenceUrl,
        },
        messageId,
      },
    })
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

export const setInitialDataLoading = payload => dispatch => {
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
  dispatch(setInitialDataLoading(true))

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

      dispatch(setInitialDataLoading(false))

      const { route } = appSelector(getState())
      const isMemberOfAnyRooms = joinedChannelsSelector(getState())

      // A route for the embedded client can be 'undefined', and for the full
      // client the channelId can also be 'undefined' in case no channel is defined
      if (route && route.params.channelId) {
        dispatch(setChannel(route.params.channelId, route.params.messageId))
      } else {
        const channels = channelsSelector(getState())
        const channelToSet = findLastUsedChannel(channels) || channels[0]
        if ((conf.channelId || channelToSet) && isMemberOfAnyRooms) {
          // In embedded chat conf.channelId is defined.
          dispatch(setChannel(conf.channelId || channelToSet.id))
        }
      }

      if (!isMemberOfAnyRooms) {
        dispatch(onShowNewConversation())
      }
    })
    .catch(err => {
      dispatch(error(err))
      reopen()
    })
}
