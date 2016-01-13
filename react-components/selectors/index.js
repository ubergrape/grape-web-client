import {createSelector} from 'reselect'
import pick from 'lodash/object/pick'

export const userSelector = createSelector(
  state => state.user, state => state
)

export const usersSelector = createSelector(
  state => state.users, state => state
)

export const channelSelector = createSelector(
  state => state.channel, state => state
)

export const channelsSelector = createSelector(
  state => state.channels, state => state
)

export const orgSelector = createSelector(
  state => state.org, state => state
)

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

export const sharedFilesSelector = createSelector(
  state => state.sharedFiles, state => state
)

export const mentionsSelector = createSelector(
  state => state.mentions, state => state
)

export const messageSearchSelector = createSelector(
  state => state.messageSearch, state => state
)

export const alertsSelector = createSelector(
  state => state.alerts, state => state
)

export const alertsAndChannelSelector = createSelector(
  [alertsSelector, channelSelector],
  ({alerts}, channel) => {
    return {alerts, channel}
  }
)

export const channelMembers = createSelector(
  [channelSelector, usersSelector],
  ({users}, allUsers) => {
    return {
      invited: users,
      users: allUsers
    }
  }
)
