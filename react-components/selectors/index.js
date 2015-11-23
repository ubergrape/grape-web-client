import {createSelector} from 'reselect'

export const channelSearchSelector = createSelector(
  state => state.channelSearch, state => state
)

export const subscriptionWarningSelector = createSelector(
  state => state.subscriptionWarning,
  state => state
)

export const typingNotificationSelector = createSelector(
  state => state.typingNotification,
  state => state
)

export const setTypingSelector = createSelector(
  ({user, users, channel, typingNotification}) => {
    return {user, users, channel, typingNotification}
  },
  state => state
)
