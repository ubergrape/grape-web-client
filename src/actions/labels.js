import noop from 'lodash/utility/noop'

import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {orgSelector, channelSelector, labelsOverviewSelector} from '../selectors'
import {error} from './common'
import {normalizeMessage} from './utils'

const normalizeLabels = (results, state) => (
  results.map(result => ({
    ...result,
    message: normalizeMessage(result.message, state)
  }))
)

export function loadLabels(options, callback = noop) {
  return (dispatch, getState) => {
    const state = getState()
    const orgId = orgSelector(state).id
    const {currentChannelOnly} = labelsOverviewSelector(state)
    let reqOptions = options

    if (currentChannelOnly) {
      reqOptions = {...options, channel: channelSelector(state).id}
    }

    dispatch({
      type: types.REQUEST_LABELS,
      payload: reqOptions
    })

    api
      .loadLabels(orgId, reqOptions)
      .then((response) => {
        dispatch({
          type: types.HANDLE_LOADED_LABELS,
          payload: normalizeLabels(response.results, state)
        })

        callback()
      })
      .catch(err => dispatch(error(err)))
  }
}
