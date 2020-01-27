import { noop } from 'lodash'

import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {
  orgSelector,
  channelSelector,
  labeledMessagesSelector,
} from '../selectors'
import { normalizeMessage } from './utils'
import { error } from './'

export const loadLabeledMessages = (options = {}, callback = noop) => (
  dispatch,
  getState,
) => {
  const state = getState()
  // to prevent triggering the same request multiple times this action is canceled
  // when the state is loading and therefor the action already has been triggered
  if (state.labeledMessages.isLoading) {
    return
  }

  const { id, labelsConfig } = orgSelector(state)
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

  api
    .loadLabeledMessages(id, reqOptions)
    .then(({ results: messages }) => {
      let type = types.HANDLE_LOADED_LABELED_MESSAGES
      if (options.offset) type = types.HANDLE_MORE_LOADED_LABELED_MESSAGES

      dispatch({
        type,
        payload: {
          messages: messages.map(message =>
            normalizeMessage(message, state, labelsConfig),
          ),
          labelsConfig,
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
