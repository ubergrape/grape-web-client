import {createSelector} from 'reselect'
import pick from 'lodash/object/pick'

export const channelSearchSelector = createSelector(
  state => state.channelSearch, state => state
)

export const billingWarningSelector = createSelector(
  state => state.billingWarning, state => state
)

export const typingNotificationSelector = createSelector(
  state => state.typingNotification, state => state
)

export const setTypingSelector = createSelector(
  state => pick(state, 'user', 'users', 'channel', 'typingNotification'),
  state => state
)

export const userProfileSelector = createSelector(
  state => state.userProfile, state => state
)

export const channelInfoSelector = createSelector(
  state => state.channelInfo, state => state
)
