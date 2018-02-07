import * as api from '../utils/backend/api'
import * as types from '../constants/actionTypes'
import {orgSelector} from '../selectors'
import {error} from './'

export const searchChannelsToMention = (org, search, limit) => (dispatch) => {
  dispatch({
    type: types.REQUEST_SEARCH_CHANNELS_TO_MENTION,
    payload: search
  })
  api
    .searchChannels({
      orgId: org.id,
      search,
      limit
    })
    .then(({q, results}) => {
      dispatch({
        type: types.HANDLE_CHANNELS_TO_MENTION,
        payload: {
          search: q,
          results
        }
      })
    })
    .catch(err => dispatch(error(err)))
}

export const searchChannels = (search, limit) => (dispatch, getState) => {
  dispatch({
    type: types.REQUEST_SEARCH_FOUND_CHANNELS,
    payload: search
  })

  const org = orgSelector(getState())
  api.searchChannels({
    orgId: org.id,
    search,
    limit
  }).then((channels) => {
    dispatch({
      type: types.HANDLE_FOUND_CHANNELS,
      payload: {
        search: channels.q,
        results: channels.results
      }
    })
  }).catch(err => dispatch(error(err)))
}
