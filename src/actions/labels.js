import noop from 'lodash/utility/noop'

import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {orgSelector} from '../selectors'
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

    api
      .loadLabels(orgId, options)
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
