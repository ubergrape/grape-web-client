import * as types from '../constants/actionTypes'

import store from '../app/store'
import {alertsSelector} from '../selectors'

export function showAlert(level, type, closeAfter, minLifeTime = 400) {
  return {
    type: types.SHOW_ALERT,
    payload: {
      level,
      type,
      date: Date.now(),
      closeAfter,
      minLifeTime
    }
  }
}

export function hideAlert(alert) {
  const action = {
    type: types.HIDE_ALERT,
    payload: {
      alert
    }
  }

  const dateDiff = Date.now() - (alert.minLifeTime + alert.date)
  if (dateDiff < 0) {
    return dispatch => {
      setTimeout(() => {
        dispatch(action)
      }, -dateDiff)
    }
  }

  return action
}

export function hideAlertsByType(type) {
  const {alerts} = alertsSelector(store.getState())
  const alertsByType = alerts.filter(alertItem => type === alertItem.type)

  return dispatch => {
    alertsByType.forEach(alertByType => {
      dispatch(hideAlert(alertByType))
    })
  }
}
