import has from 'lodash/has'

import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import { channelSelector, confSelector } from '../selectors'
import { normalizeMessage } from './utils'
import { setSidebarIsLoading, error } from './'

export const loadPinnedMessages = () => (dispatch, getState) => {
  dispatch({ type: types.REQUEST_PINNED_MESSAGES })
  dispatch(setSidebarIsLoading(true))
  const state = getState()
  const channelId = channelSelector(state).id

  api
    .loadPinnedMessages(channelId)
    .then(({ results, total }) => {
      dispatch(setSidebarIsLoading(false))
      const items = results.map(message => normalizeMessage(message, state))
      dispatch({
        type: types.HANDLE_PINNED_MESSAGES,
        payload: {
          items,
          total,
        },
      })
    })
    .catch(err => {
      dispatch(setSidebarIsLoading(false))
      dispatch(error(err))
    })
}

export const pinMessage = ({ channelId, messageId }) => (
  dispatch,
  getState,
) => {
  dispatch({
    type: types.REQUEST_PIN_MESSAGE,
    payload: messageId,
  })
  api
    .pinMessage(channelId, messageId)
    .then(() => {
      const conf = confSelector(getState())
      if (has(conf, 'callbacks.onPin')) conf.callbacks.onPin()
    })
    .catch(err => dispatch(error(err)))
}

export const unpinMessage = ({ channelId, messageId }) => (
  dispatch,
  getState,
) => {
  dispatch({
    type: types.REQUEST_UNPIN_MESSAGE,
    payload: messageId,
  })
  api
    .unpinMessage(channelId, messageId)
    .then(() => {
      const conf = confSelector(getState())
      if (has(conf, 'callbacks.onUnpin')) conf.callbacks.onUnpin()
    })
    .catch(err => dispatch(error(err)))
}
