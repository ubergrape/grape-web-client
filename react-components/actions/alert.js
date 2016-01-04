import * as types from '../constants/actionTypes'

import store from '../app/store'
import {alertsSelector} from '../selectors'

export function showAlert({level, type, closeAfter, minLifeTime = 1000, delay}) {
  return {
    type: types.SHOW_ALERT,
    payload: {
      level,
      type,
      timeStamp: Date.now(),
      closeAfter,
      minLifeTime,
      delay
    }
  }
}

export function hideAlert(alert = {}) {
  const action = {
    type: types.HIDE_ALERT,
    payload: alert
  }

  const delay = Date.now() - (alert.minLifeTime + alert.timeStamp)
  const isInThePast = delay < 0

  if (isInThePast) {
    return dispatch => {
      setTimeout(() => {
        dispatch(action)
      }, -dateDiff)
    }
  }

  return action
}

export function clearAlertDelay(alert) {
  return {
    type: types.CLEAR_ALERT_DELAY,
    payload: {
      alert
    }
  }
}

export function hideAlertByType(type) {
  const {alerts} = alertsSelector(store.getState())
  const alertByType = alerts.filter(alertItem => type === alertItem.type)

  return dispatch => {
    dispatch(hideAlert(alertByType[0]))
  }
}
