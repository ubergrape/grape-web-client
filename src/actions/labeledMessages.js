import noop from 'lodash/utility/noop'
import find from 'lodash/collection/find'
import map from 'lodash/collection/map'

import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {orgSelector, channelSelector, labeledMessagesSelector} from '../selectors'
import {error} from './common'
import {normalizeMessage} from './utils'

const normalizeMessageLabels = (labels, labelConfigs) => (
  labels
    // Just a precaution in case the config doesn't have all labels.
    .filter(label => !!labelConfigs[label.name])
    // Deduplicate labels. There might the same label at different position.
    .reduce((uniqLabels, label) => {
      if (!find(uniqLabels, {name: label.name})) {
        uniqLabels.push(label)
      }
      return uniqLabels
    }, [])
    .map((label) => {
      const conf = labelConfigs[label.name]

      return {
        id: label.id,
        color: conf.color,
        nameLocalized: conf.name
      }
    })
)

const normalizeMessages = (messages, labelConfigs, state) => (
  messages.map(message => ({
    ...normalizeMessage(message, state),
    labels: normalizeMessageLabels(message.labels, labelConfigs)
  }))
)

const normalizeLabelConfigs = configs => map(configs, (conf, name) => ({
  name,
  nameLocalized: conf.name,
  color: conf.color
}))

export const loadLabeledMessages = (options = {}, callback = noop) => (
  (dispatch, getState) => {
    const state = getState()
    const orgId = orgSelector(state).id
    const {currentChannelOnly} = labeledMessagesSelector(state)
    let reqOptions = options

    if (currentChannelOnly) {
      reqOptions = {...options, channel: channelSelector(state).id}
    }

    dispatch({
      type: types.REQUEST_LABELED_MESSAGES,
      payload: reqOptions
    })

    Promise.all([
      api.loadLabeledMessages(orgId, reqOptions),
      api.loadLabelsConfig(orgId)
    ])
      .then(([{results: messages}, {labels: labelConfigs}]) => {
        let type = types.HANDLE_LOADED_LABELED_MESSAGES
        if (options.offset) type = types.HANDLE_MORE_LOADED_LABELED_MESSAGES

        dispatch({
          type,
          payload: {
            messages: normalizeMessages(messages, labelConfigs, state),
            labelConfigs: normalizeLabelConfigs(labelConfigs)
          }
        })

        callback()
      })
      .catch(err => dispatch(error(err)))
  }
)

export const handleMessageLabeled = payload => (
  (dispatch) => {
    dispatch({
      type: types.HANDLE_MESSAGE_LABELED,
      payload
    })
  }
)
