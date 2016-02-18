import {createSelector} from 'reselect'
import find from 'lodash/collection/find'

// TODO: use this from lodash 4 after
// https://github.com/ubergrape/chatgrape/issues/3326
import differenceBy from 'lodash.differenceby'

export const usersSelector = createSelector(
  state => state.users, state => state
)

export const activeUsersSelector = createSelector(
  usersSelector, users => users.filter(user => user.active)
)

export const userSelector = createSelector(
  usersSelector, users => find(users, 'current') || {}
)

export const initialChannelsSelector = createSelector(
  state => state.channels, state => state
)

/**
 * fill `initialChannelsSelector` with user objects
 * instead of ID's
 */
export const channelsSelector = createSelector(
  [
    initialChannelsSelector,
    usersSelector
  ],
  (
    channels,
    users
  ) => {
    return channels.map(channel => {
      return {
        ...channel,
        users: channel.users.map(id => find(users, {id}))
      }
    })
  }
)

export const channelSelector = createSelector(
  channelsSelector, channels => find(channels, 'current') || {}
)

export const roomsSelector = createSelector(
  channelsSelector, channels => channels.filter(channel => channel.type === 'room')
)

export const pmsSelector = createSelector(
  [channelsSelector, userSelector], (channels, user) => {
    return channels
      .filter(channel => channel.type === 'pm')
      .map(channel => {
        return {
          ...channel,
          mate: find(channel.users, _user => _user.id !== user.id)
        }
      })
  }
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
  [
    userSelector,
    usersSelector,
    channelSelector,
    typingNotificationSelector
  ],
  (
    user,
    users,
    channel,
    typingNotification
  ) => {
    return {
      user,
      users,
      channel,
      typingNotification
    }
  }
)

export const userProfileSelector = createSelector(
  state => state.userProfile, state => state
)

export const userProfileComponentSelector = createSelector(
  [
    userProfileSelector,
    channelSelector,
    userSelector
  ],
  (
    userProfile,
    channel,
    currentUser
  ) => {
    const user = find(channel.users, _user => _user.id !== currentUser.id) || {}
    return {
      ...userProfile,
      user
    }
  }
)

export const channelInfoSelector = createSelector(
  state => state.channelInfo, state => state
)

export const channelInfoComponentSelector = createSelector(
  [
    channelInfoSelector,
    channelSelector,
    userSelector
  ],
  (
    channelInfo,
    channel,
    user
  ) => {
    return {
      ...channelInfo,
      channel: channel.type === 'room' ? channel : {},
      user
    }
  }
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
    activeUsersSelector,
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
    roomsSelector,
    channelSelector,
    pmsSelector,
    usersSelector,
    userSelector
  ],
  (
    rooms,
    channel,
    pms,
    users,
    user
  ) => {
    const recent = rooms
      .filter(_channel => _channel.joined)
      .concat(pms)
      .sort((a, b) => b.latestMessageTime - a.latestMessageTime)

    console.log(recent)
    return {
      recent,
      channel,
      user
    }
  }
)
