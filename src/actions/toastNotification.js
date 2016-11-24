import random from 'lodash/number/random'

import * as types from '../constants/actionTypes'

export function showToastNotification(message, options = {}) {
  const key = random(1000)
  return {
    type: types.SHOW_TOAST_NOTIFICATION,
    payload: {
      message,
      key,
      ...options
    }
  }
}

export function hideToastNotification(key) {
  return {
    type: types.HIDE_TOAST_NOTIFICATION,
    payload: {
      key
    }
  }
}
