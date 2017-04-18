import noop from 'lodash/utility/noop'
import find from 'lodash/collection/find'
import indexBy from 'lodash/collection/indexBy'

import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {orgSelector, channelSelector, labeledMessagesSelector} from '../selectors'
import {error} from './common'
import {normalizeMessage} from './utils'

const normalizeMessageLabels = (labels, labelConfigs) => {
  const configsMap = indexBy(labelConfigs, 'name')

  return labels
    // Just a precaution in case the config doesn't have all labels.
    .filter(label => !!configsMap[label.name])
    // Deduplicate labels. There might the same label at different position.
    .reduce((uniqLabels, label) => {
      if (!find(uniqLabels, {name: label.name})) {
        uniqLabels.push(label)
      }
      return uniqLabels
    }, [])
    .map((label) => {
      const conf = configsMap[label.name]

      return {
        id: label.id,
        color: conf.color,
        name: conf.name,
        nameLocalized: conf.localized
      }
    })
}

const normalizeMessages = (messages, labelConfigs, state) => (
  messages.map(message => ({
    ...normalizeMessage(message, state),
    labels: normalizeMessageLabels(message.labels, labelConfigs)
  }))
)

const normalizeLabelConfigs = configs => configs.map(conf => ({
  name: conf.name,
  nameLocalized: conf.localized,
  color: conf.color
}))

// Load a config and caches a promise based on org id.
const loadLabelsConfigCached = (() => {
  let promise
  let prevOrgId

  return (orgId) => {
    if (prevOrgId !== orgId) {
      prevOrgId = orgId
      promise = api.loadLabelsConfig(orgId)
    }
    return promise
  }
})()

export const loadLabeledMessages = (options = {}, callback = noop) => (
  (dispatch, getState) => {
    const state = getState()
    const orgId = orgSelector(state).id
    const {currentChannelOnly, filter} = labeledMessagesSelector(state)
    let reqOptions = {...options, labels: filter === 'all' ? null : [filter]}

    if (currentChannelOnly) {
      reqOptions = {...reqOptions, channel: channelSelector(state).id}
    }

    dispatch({
      type: types.REQUEST_LABELED_MESSAGES,
      payload: reqOptions
    })

    Promise.all([
      api.loadLabeledMessages(orgId, reqOptions),
      loadLabelsConfigCached(orgId)
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

export const handleMessageLabeled = message => (
  (dispatch, getState) => {
    const {filter} = labeledMessagesSelector(getState())

    // Ignore messages which don't pass the filter.
    if (filter !== 'all' && message.labels.indexOf(filter) === -1) {
      return
    }

    dispatch({
      type: types.HANDLE_MESSAGE_LABELED,
      payload: message
    })
  }
)

export const selectLabeledMessagesFilter = ({name}) => (
  (dispatch) => {
    dispatch({
      type: types.SELECT_LABELED_MESSAGE_FILTER,
      payload: name
    })
  }
)

