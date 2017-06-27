import notify from 'html5-desktop-notifications'

import {orgSelector} from '../selectors'
import * as types from '../constants/actionTypes'
import * as alerts from '../constants/alerts'
import {shouldRequestPermission} from '../utils/notifications'
import * as api from '../utils/backend/api'
import client from '../utils/backend/client'
import {showAlert} from './alert'
import {error} from './common'

export function setNotificationSession() {
  return (dispatch, getState) => {
    const options = {
      clientId: client().id,
      orgId: orgSelector(getState()).id
    }
    dispatch({
      type: types.REQUEST_BROWSER_NOTIFICATION_SESSION,
      payload: options
    })
    api.setNotificationSession(options).catch(error)
  }
}

export function enableNotifications() {
  return (dispatch) => {
    dispatch({type: types.ENABLE_BROWSER_NOTIFICATIONS})
    notify.requestPermission((permission) => {
      if (permission === notify.PERMISSION_GRANTED) {
        dispatch(setNotificationSession())
      }
    })
  }
}

export function ensureBrowserNotificationPermission() {
  return (dispatch) => {
    if (shouldRequestPermission()) {
      dispatch(showAlert({
        level: 'info',
        type: alerts.NOTIFICATIONS_REMINDER
      }))
    } else {
      dispatch(setNotificationSession())
    }
  }
}
