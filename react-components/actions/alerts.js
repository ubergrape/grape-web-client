import * as types from '../constants/actionTypes'

import find from 'lodash/collection/find'

import store from '../app/store'
import {alertsSelector} from '../selectors'

export function showAlert(level, type, closeAfter) {
  return {
    type: types.SHOW_ALERT,
    payload: {
      level,
      type,
      closeAfter
    }
  }
}

export function hideAlert(alert) {
  return {
    type: types.HIDE_ALERT,
    payload: {
      alert
    }
  }
}

export function hideAlertByType(type) {
  const {alerts} = alertsSelector(store.getState())
  const alert = find(alerts, alert => alert.type === type)

  return dispatch => {
    dispatch(hideAlert(alert))
  }
}

