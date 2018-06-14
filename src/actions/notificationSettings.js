import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { orgSelector } from '../selectors'
import { error } from './'

export function loadNotificationSettings({ channel }) {
  return (dispatch, getState) => {
    const org = orgSelector(getState())

    dispatch({
      type: types.REQUEST_NOTIFICATION_SETTINGS,
      payload: { channel },
    })

    api
      .getNotificationSettings(org.id, channel.id)
      .then(settings => {
        dispatch({
          type: types.HANDLE_NOTIFICATION_SETTINGS,
          payload: settings,
        })
      })
      .catch(err => {
        dispatch(error(err))
      })
  }
}

export function setNotificationSetting(channel, options) {
  return (dispatch, getState) => {
    dispatch({
      type: types.REQUEST_NOTIFICATION_SETTINGS_UPDATE,
      payload: { channel, options },
    })

    const org = orgSelector(getState())

    api
      .setNotificationSetting(org.id, channel.id, options)
      .then(() => {
        dispatch(loadNotificationSettings({ channel }))
      })
      .catch(err => {
        dispatch(error(err))
      })
  }
}

export function showNotificationSettings({ channel }) {
  return dispatch => {
    dispatch({
      type: types.SHOW_NOTIFICATION_SETTINGS,
      payload: { channel },
    })

    dispatch(loadNotificationSettings({ channel }))
  }
}

export function hideNotificationSettings() {
  return {
    type: types.HIDE_NOTIFICATION_SETTINGS,
  }
}
