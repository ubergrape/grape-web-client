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
    .searchOverview({
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

  const lastChannel = channels
    .filter(({ lastMessageTime, favorited }) => lastMessageTime && !favorited)
    .sort((a, b) => {
      if (a.lastMessageTime < b.lastMessageTime) return -1
      if (a.lastMessageTime > b.lastMessageTime) return 1
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
