import indexBy from 'lodash/collection/indexBy'

import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {orgSelector, usersSelector, channelsSelector} from '../selectors'
import {error} from './common'

const formatLabels = (results, state) => {
  const users = usersSelector(state)
  const channels = channelsSelector(state)
  const usersMap = indexBy(users, 'id')
  const channelsMap = indexBy(channels, 'id')

  return results.map(result => ({
    ...result,
    message: {
      ...result.message,
      time: new Date(result.message.time),
      channel: channelsMap[result.message.channel],
      author: usersMap[result.message.author.id]
    }
  }))
}

export function loadLabels(options) {
  return (dispatch, getState) => {
    const state = getState()
    const orgId = orgSelector(state).id
    api
      .loadLabels(orgId, options)
      .then((response) => {
        dispatch({
          type: types.HANDLE_LOADED_LABELS,
          payload: formatLabels(response.results, state)
        })
      })
      .catch(err => dispatch(error(err)))
  }
}
