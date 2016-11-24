import {v4 as uuid} from 'uuid'

import * as types from '../constants/actionTypes'

export function requestRemoveNotificationStack(key) {
  return {
    type: types.REQUEST_REMOVE_NOTIFICATION_STACK,
    payload: {
      key
    }
  }
}

export function requestShowNotificationStack(message, options = {}) {
  const key = uuid()
  // react-notification onClick is called with parameter deactivate,
  // which is a function and can be called to set the notification to inactive.
  // Used to activate notification exit animation on click.
  // We also pass the unique notification `key`
  // in case we need to dispatch a remove action.
  const {onClick: _onClick} = options
  const onClick = _onClick ? (deactivate) => _onClick(deactivate, key) : null

  return {
    type: types.REQUEST_ADD_NOTIFICATION_STACK,
    payload: {
      message,
      key,
      ...options,
      onClick
    }
  }
}
