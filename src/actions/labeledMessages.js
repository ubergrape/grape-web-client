import noop from 'lodash/utility/noop'

import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {orgSelector, channelSelector, labeledMessagesSelector} from '../selectors'
import {error} from './common'
import {normalizeMessage} from './utils'

const normalizeMessageLabels = (labels, labelConfigs) => (
  labels
    .map(label => labelConfigs[label.name])
    // Just a precaution.
    .filter(label => !!label)
    .map(label => ({
      color: label.color,
      nameLocalized: label.name
    }))
)

const normalizeMessages = (messages, labelConfigs, state) => (
  messages.map(message => ({
    ...normalizeMessage(message, state),
    labels: normalizeMessageLabels(message.labels, labelConfigs)
  }))
)

export function loadLabeledMessages(options, callback = noop) {
  return (dispatch, getState) => {
    const state = getState()
    const orgId = orgSelector(state).id
    const {currentChannelOnly} = labeledMessagesSelector(state)
    let reqOptions = options

    if (currentChannelOnly) {
      reqOptions = {...options, channel: channelSelector(state).id}
    }

    dispatch({
      type: types.REQUEST_LABELS,
      payload: reqOptions
    })

    Promise.all([
      api.loadLabeledMessages(orgId, reqOptions),
      api.loadLabelsConfig(orgId)
    ])
      .then(([{results}, {labels}]) => {
        dispatch({
          type: types.HANDLE_LOADED_LABELS,
          payload: normalizeMessages(results, labels, state)
        })

        callback()
      })
      .catch(err => dispatch(error(err)))
  }
}
