import * as api from '../utils/backend/api'
import * as types from '../constants/actionTypes'
import { orgSelector } from '../selectors'
import { error } from './'

export const searchChannelsForNavigation = search => (dispatch, getState) => {
  dispatch({
    type: types.REQUEST_SEARCH_CHANNELS_FOR_NAV,
    payload: search,
  })

  const org = orgSelector(getState())
  api
    .searchChannels({
      orgId: org.id,
      search,
    })
    .then(({ q, results }) => {
      dispatch({
        type: types.HANDLE_FOUND_CHANNELS_FOR_NAV,
        payload: {
          search: q,
          results,
        },
      })
    })
    .catch(err => dispatch(error(err)))
}
