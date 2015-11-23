import {createSelector} from 'reselect'

export const channelSearchSelector = createSelector(
  store => store.channelSearch, channelSearch => channelSearch
)

export const subscriptionWarningSelector = createSelector(
  store => store.subscriptionWarning,
  subscriptionWarning => subscriptionWarning
)

export const typingNotificationSelector = createSelector(
  store => store.typingNotification,
  typingNotification => typingNotification
)
