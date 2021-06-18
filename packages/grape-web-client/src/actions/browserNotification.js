import { orgSelector } from '../selectors'
import * as types from '../constants/actionTypes'
import * as alerts from '../constants/alerts'
import { shouldRequestPermission } from '../utils/notifications'
import * as api from '../utils/backend/api'
import client from '../utils/backend/client'
import { error, showAlert } from './'

export function setNotificationSession() {
  return (dispatch, getState) => {
    const options = {
      clientId: client().id,
      orgId: orgSelector(getState()).id,
    }
    dispatch({
      type: types.REQUEST_BROWSER_NOTIFICATION_SESSION,
      payload: options,
    })
    api.setNotificationSession(options).catch(err => {
      dispatch(error(err))
    })
  }
}

export function enableNotifications() {
  return dispatch => {
    dispatch({ type: types.ENABLE_BROWSER_NOTIFICATIONS })
    if (Notification.permission === 'granted') {
      dispatch(setNotificationSession())
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(permission => {
        if (permission === 'granted') {
          dispatch(setNotificationSession())
        }
      })
    }
  }
}

export const setNotification = payload => dispatch => {
  dispatch({ type: types.SET_NOTIFICATION, payload })
}

export function ensureBrowserNotificationPermission() {
  return dispatch => {
    if (shouldRequestPermission()) {
      dispatch(
        showAlert({
          level: 'info',
          type: alerts.NOTIFICATIONS_REMINDER,
          isClosable: true,
        }),
      )
    } else {
      dispatch(setNotificationSession())
    }
  }
}
