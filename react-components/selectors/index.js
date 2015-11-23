import {createSelector} from 'reselect'
import pick from 'lodash/object/pick'

export const channelSearchSelector = createSelector(
  state => state.channelSearch, state => state
)

export const subscriptionWarningSelector = createSelector(
  state => state.subscriptionWarning, state => state
)

export const typingNotificationSelector = createSelector(
  state => state.typingNotification, state => state
)

export const setTypingSelector = createSelector(
  state => pick(state, 'user', 'users', 'channel', 'typingNotification'),
  state => state
)
