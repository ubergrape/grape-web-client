import {createSelector} from 'reselect'

export const channelSelector = createSelector(
  store => store.channelSearch, channelSearch => channelSearch
)
