import random from 'lodash/number/random'

import * as types from '../constants/actionTypes'

export function hideToastNotification(key) {
  return {
    type: types.HIDE_TOAST_NOTIFICATION,
    payload: {
      key
    }
  }
}

export function showToastNotification(message, options = {}) {
  const key = random(1000)
  // react-notification onClick is called with parameter deactivate,
  // which is a function and can be called to set the notification to inactive.
  // Used to activate notification exit animation on click.
  // We also pass the unique notification `key`
  // in case we need to dispatch a remove action.
  const {onClick: _onClick} = options
  const onClick = _onClick ? (deactivate) => _onClick(deactivate, key) : null
  return {
    type: types.SHOW_TOAST_NOTIFICATION,
    payload: {
      message,
      key,
      ...options,
      onClick
    }
  }
}
