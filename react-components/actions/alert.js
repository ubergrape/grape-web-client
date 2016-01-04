import * as types from '../constants/actionTypes'

import store from '../app/store'
import {alertsSelector} from '../selectors'

const delayedTimeoutIds = {}

export function showAlert({level, type, closeAfter, minLifeTime = 1000, delay}) {
  const action = {
    type: types.SHOW_ALERT,
    payload: {
      level,
      type,
      timeStamp: Date.now(),
      closeAfter,
      minLifeTime
    }
  }

  if (delay) {
    return dispatch => {
      clearTimeout(delayedTimeoutIds[type])
      delayedTimeoutIds[type] = setTimeout(() => {
        dispatch(action)
      }, delay)
    }
  }

  return action
}

export function hideAlert(alert) {
  const action = {
    type: types.HIDE_ALERT,
    payload: alert
  }

  const delay = Date.now() - (alert.minLifeTime + alert.timeStamp)
  const isInThePast = delay < 0

  if (isInThePast) {
    return dispatch => {
      setTimeout(() => {
        clearTimeout(delayedTimeoutIds[alert.type])
        dispatch(action)
      }, -delay)
    }
  }
  clearTimeout(delayedTimeoutIds[alert.type])
  return action
}

export function hideAlertByType(type) {
  const {alerts} = alertsSelector(store.getState())
  const alertByType = alerts.filter(alertItem => type === alertItem.type)[0]
  if (alertByType) return hideAlert(alertByType)

  clearTimeout(delayedTimeoutIds[type])
  return {type: types.NOOP}
}
