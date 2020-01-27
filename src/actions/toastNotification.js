import { random } from 'lodash'

import * as types from '../constants/actionTypes'

export function showToastNotification(message, options = {}) {
  const key = options.key || random(1e5)
  return {
    type: types.SHOW_TOAST_NOTIFICATION,
    payload: {
      key,
      message,
      ...options,
    },
  }
}

export function hideToastNotification({ key }) {
  return {
    type: types.HIDE_TOAST_NOTIFICATION,
    payload: {
      key,
    },
  }
}

export function updateToastNotification(key, message, options = {}) {
  const payload = { key, ...options }
  if (message) payload.message = message
  return {
    type: types.UPDATE_TOAST_NOTIFICATION,
    payload,
  }
}
