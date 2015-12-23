import * as types from '../constants/actionTypes'

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

