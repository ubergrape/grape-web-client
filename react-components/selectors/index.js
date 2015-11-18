import {createSelector} from 'reselect'

export const channelSelector = createSelector(
  store => store.channelSearch, channelSearch => channelSearch
)

export const subscriptionWarningSelector = createSelector(
  store => store.subscriptionWarning,
  subscriptionWarning => subscriptionWarning
)
