import * as api from '../utils/backend/api'
import * as types from '../constants/actionTypes'
import {error} from './'

export const searchChannelsToMention = (org, search, limit) => (dispatch) => {
  dispatch({type: types.REQUEST_SEARCH_CHANNELS_TO_MENTION})
  api.searchChannels({
    orgId: org.id,
    search,
    limit
  }).then((channels) => {
    dispatch({
      type: types.HANDLE_CHANNELS_TO_MENTION,
      payload: channels.results
    })
  }).catch(err => dispatch(error(err)))
}
