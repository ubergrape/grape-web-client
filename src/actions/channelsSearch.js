import * as api from '../utils/backend/api'
import * as types from '../constants/actionTypes'
import {error} from './'

export const searchChannelsToMention = (...args) => (dispatch) => {
  dispatch({
    type: types.REQUEST_SEARCH_CHANNELS_TO_MENTION,
    payload: args
  })
  api.searchChannels({
    orgId: args.id,
    search: args.search,
    limit: args.limit
  }).then((channels) => {
    dispatch({
      type: types.HANDLE_CHANNELS_TO_MENTION,
      payload: channels.results
    })
  }).catch(err => dispatch(error(err)))
}
