import {createSelector} from 'reselect'
import find from 'lodash/collection/find'
import pick from 'lodash/object/pick'
// TODO: use this from lodash 4 after
// https://github.com/ubergrape/chatgrape/issues/3326
import differenceBy from 'lodash.differenceby'

export const initialDataLoadingSelector = createSelector(
  state => state.initialDataLoading.loading, state => state
)

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
 * Fill the `initialChannelsSelector` with user objects
 * instead of user ID's.
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

export const joinedRoomsSelector = createSelector(
  roomsSelector, rooms => rooms.filter(room => room.joined)
)

export const pmsSelector = createSelector(
  [channelsSelector, userSelector], (channels, user) => {
    return channels
      .filter(channel => channel.type === 'pm')
      .map(channel => {
        const mate = find(channel.users, _user => _user.id !== user.id)
        return {
          ...channel,
          slug: mate.slug,
          mate
        }
      })
  }
)

export const activePmsSelector = createSelector(
  pmsSelector, pms => pms.filter(pm => pm.firstMessageTime)
)

export const currentPmsSelector = createSelector(
  pmsSelector, pms => find(pms, 'current') || {}
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

export const channelSearch = createSelector(
  state => state.channelSearch, state => state
)

export const channelSearchSelector = createSelector(
  [
    channelSearch,
    fullOrgSelector,
    userSelector
  ],
  (
    search,
    org,
    user
  ) => {
    return {
      ...search,
      org,
      user
    }
  }
)

export const billingWarningSelector = createSelector(
  state => state.billingWarning, state => state
)

export const typingChannelsSelector = createSelector(
  state => state.typingChannels, state => state
)

export const typingNotificationSelector = createSelector(
  [typingChannelsSelector, channelSelector],
  (typingNotification, channel) => {
    return {
      channel,
      channels: typingNotification
    }
  }
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

export const userProfile = createSelector(
  state => state.userProfile, state => state
)

export const userProfileSelector = createSelector(
  [
    userProfile,
    currentPmsSelector
  ],
  (
    profile,
    pm
  ) => {
    return {
      ...profile,
      ...pm.mate
    }
  }
)

export const channelInfo = createSelector(
  state => state.channelInfo, state => state
)

export const channelInfoSelector = createSelector(
  [
    channelInfo,
    channelSelector,
    userSelector
  ],
  (
    info,
    channel,
    user
  ) => {
    return {
      ...info,
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

export const intercomSelector = createSelector(
  state => state.intercom, state => state
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
  [joinedRoomsSelector, activePmsSelector, channelSelector],
  (rooms, pms, channel) => {
    const channelName = channel.name || channel.users && channel.users[0].displayName
    return {
      amount: rooms.concat(pms).filter(_channel => _channel.unread).length,
      channelName
    }
  }
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

export const orgInfoSelector = createSelector(
  [
    orgSelector,
    initialDataLoadingSelector,
    userSelector
  ],
  (
    org,
    isLoading,
    {displayName: username}
  ) => {
    return {
      ...org,
      isLoading,
      username
    }
  }
)

export const navigationPmsSelector = createSelector(
  pmsSelector, pms => {
    return pms.filter(pm => {
      return pm.firstMessageTime || pm.temporaryInNavigation || pm.favorited
    })
  }
)

function unixToIsoTimestamp(timestamp) {
  return new Date(timestamp * 1000).getTime()
}

function sortRecentChannels(a, b) {
  let bCompareValue
  let aCompareValue

  if (a.temporaryInNavigation) {
    aCompareValue = a.temporaryInNavigation
  } else {
    aCompareValue = a.latestMessageTime || unixToIsoTimestamp(a.created)
  }

  if (b.temporaryInNavigation) {
    bCompareValue = b.temporaryInNavigation
  } else {
    bCompareValue = b.latestMessageTime || unixToIsoTimestamp(b.created)
  }

  return bCompareValue - aCompareValue
}

export const navigationSelector = createSelector(
  [
    joinedRoomsSelector,
    channelSelector,
    navigationPmsSelector,
    initialDataLoadingSelector
  ],
  (
    rooms,
    channel,
    pms,
    isLoading
  ) => {
    const all = rooms.concat(pms)
    const recent = all
      .filter(_channel => !_channel.favorited)
      .sort(sortRecentChannels)
    const favorited = all
      .filter(_channel => _channel.favorited)
      .sort((a, b) => b.favorited.order - a.favorited.order)

    return {
      recent,
      favorited,
      isLoading,
      channel
    }
  }
)

export const favoriteSelector = createSelector(
  channelSelector, ({favorited, id}) => {
    return {
      favorited: Boolean(favorited),
      id
    }
  }
)

export const sidebarSelector = createSelector(
  state => state.sidebar, state => state
)

export const sidebarComponentSelector = createSelector(
  [
    sidebarSelector,
    channelInfoSelector,
    userProfileSelector,
    sharedFilesSelector,
    messageSearchSelector,
    mentionsSelector
  ],
  (
    {show},
    info,
    profile,
    files,
    search,
    mentions
  ) => {
    const select = {
      show
    }
    if (!show) return select

    const panels = {
      info,
      profile,
      files,
      search,
      mentions
    }
    return {...select, ...panels[show]}
  }
)

export const headerSelector = createSelector(
  [
    favoriteSelector,
    channelSelector,
    sidebarSelector
  ],
  (
    favorite,
    channel,
    {show: sidebar}
  ) => {
    return {
      ...pick(channel, [
        'name',
        'description'
      ]),
      ...favorite,
      sidebar
    }
  }
)
