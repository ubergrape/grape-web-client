import {createSelector} from 'reselect'
import pick from 'lodash/object/pick'
// TODO: use this from lodash 4 after
// https://github.com/ubergrape/chatgrape/issues/3326
import differenceBy from 'lodash.differenceby'

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

export const roomsSelector = createSelector(
  state => state.rooms, state => state
)

export const pmsSelector = createSelector(
  state => state.pms, state => state
)

export const orgSelector = createSelector(
  state => state.org, state => state
)

export const fullOrgSelector = createSelector(
  [
    orgSelector,
    channelsSelector,
    usersSelector,
    roomsSelector,
    pmsSelector
  ],
  (
    org,
    channels,
    users,
    rooms,
    pms
  ) => {
    return {
      ...orgSelector,
      channels,
      users,
      rooms,
      pms
    }
  }
)

export const channelSearchSelector = createSelector(
  state => state.channelSearch, state => state
)

export const channelSearchComponentSelector = createSelector(
  [
    channelSearchSelector,
    fullOrgSelector,
    userSelector
  ],
  (
    channelSearch,
    org,
    user
  ) => {
    return {
      ...channelSearch,
      org,
      user
    }
  }
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

export const inviteChannelMemebersSelector = createSelector(
  state => state.inviteChannelMemebers, state => state
)

export const alertsAndChannelSelector = createSelector(
  [alertsSelector, channelSelector],
  ({alerts}, channel) => {
    return {alerts, channel}
  }
)

export const unreadChannelsSelector = createSelector(
  state => state.unreadChannels, state => state
)

export const inviteDialog = createSelector(
  [
    channelSelector,
    inviteChannelMemebersSelector,
    usersSelector,
    orgSelector,
    userSelector
  ],
  (
    channel,
    inviteChannelMemebers,
    allUsers,
    {inviterRole},
    {role}
  ) => {
    return {
      ...inviteChannelMemebers,
      users: differenceBy(allUsers, channel.users, inviteChannelMemebers.listed, 'id'),
      isInviter: role >= inviterRole,
      channelType: channel.type
    }
  }
)

export const navigation = createSelector(
  [
    channelsSelector,
    channelSelector,
    usersSelector,
    userSelector
  ],
  (
    channels,
    channel,
    users,
    user
  ) => {
    const recent = channels
      .filter(_channel => _channel.joined)
      .concat(
        users
          .filter(_user => _user.pm)
          .map(_user => {
            return {..._user, latestMessageTime: _user.pm.latestMessageTime}
          })
      )
      .sort((a, b) => a.latestMessageTime - b.latestMessageTime)

    return {
      recent,
      channel,
      user
    }
  }
)
