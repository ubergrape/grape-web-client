import * as api from '../utils/backend/api'
import * as types from '../constants/actionTypes'
import { itemsToLoad } from '../constants/navigation'
import { orgSelector, confSelector, channelsSelector } from '../selectors'
import { error, setChannels } from './'

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

export const loadOlderChannels = () => (dispatch, getState) => {
  const conf = confSelector(getState())
  const channels = channelsSelector(getState())

  const lastChannel = channels.sort((a, b) => {
    const aTime =
      a.lastMessageTime === null ? new Date().toISOString() : a.lastMessageTime
    const bTime =
      b.lastMessageTime === null ? new Date().toISOString() : b.lastMessageTime
    if (aTime < bTime) return -1
    if (aTime > bTime) return 1
    return 0
  })[0]

  api
    .getOverview(conf.organization.id, {
      limit: itemsToLoad,
      olderThen: [lastChannel.lastMessageTime, lastChannel.id],
    })
    .then(_channels => {
      dispatch(setChannels(_channels))
    })
    .catch(err => dispatch(error(err)))
}
