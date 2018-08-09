import noop from 'lodash/noop'

import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {
  orgSelector,
  channelSelector,
  labeledMessagesSelector,
} from '../selectors'
import { normalizeMessage, loadLabelsConfigCached } from './utils'
import { error } from './'

export const loadLabeledMessages = (options = {}, callback = noop) => (
  dispatch,
  getState,
) => {
  const state = getState()
  const orgId = orgSelector(state).id
  const {
    options: { currentChannelOnly },
    filter,
  } = labeledMessagesSelector(state)
  let reqOptions = { ...options, labels: filter === 'all' ? null : [filter] }

  if (currentChannelOnly.status) {
    reqOptions = { ...reqOptions, channel: channelSelector(state).id }
  }

  dispatch({
    type: types.REQUEST_LABELED_MESSAGES,
    payload: reqOptions,
  })

  Promise.all([
    api.loadLabeledMessages(orgId, reqOptions),
    loadLabelsConfigCached(orgId),
  ])
    .then(([{ results: messages }, labelConfigs]) => {
      let type = types.HANDLE_LOADED_LABELED_MESSAGES
      if (options.offset) type = types.HANDLE_MORE_LOADED_LABELED_MESSAGES

      dispatch({
        type,
        payload: {
          messages: messages.map(message =>
            normalizeMessage(message, state, labelConfigs),
          ),
          labelConfigs,
        },
      })

      callback()
    })
    .catch(err => dispatch(error(err)))
}

export const handleMessageLabeled = message => dispatch => {
  dispatch({
    type: types.HANDLE_MESSAGE_LABELED,
    payload: message,
  })
}

export const selectLabeledMessagesFilter = ({ name }) => dispatch => {
  dispatch({
    type: types.SELECT_LABELED_MESSAGE_FILTER,
    payload: name,
  })
}
