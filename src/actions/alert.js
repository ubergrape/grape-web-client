import * as types from '../constants/actionTypes'
import {alertsSelector} from '../selectors'

import find from 'lodash/collection/find'

const delayedTimeoutIds = {}

export function showAlert({level, type, closeAfter, minLifeTime = 1000, delay}) {
  const action = {
    type: types.SHOW_ALERT,
    payload: {
      level,
      type,
      timestamp: Date.now(),
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

  const delay = Date.now() - (alert.minLifeTime + alert.timestamp)
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
  return (dispatch, getState) => {
    const {alerts} = alertsSelector(getState())
    const alertByType = find(alerts, alertItem => type === alertItem.type)
    if (alertByType) return dispatch(hideAlert(alertByType))

    clearTimeout(delayedTimeoutIds[type])
    dispatch({type: types.NOOP})
  }
}
