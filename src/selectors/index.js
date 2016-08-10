import {createSelector} from 'reselect'
import find from 'lodash/collection/find'
import omit from 'lodash/object/omit'
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
  [initialChannelsSelector, usersSelector, userSelector],
  (channels, users, user) => (
    channels.map(channel => {
      const channelUsers = channel.users.map(id => find(users, {id}))
      if (channel.type === 'room') {
        return {
          ...channel,
          users: channelUsers
        }
      }
      if (channel.type === 'pm') {
        const mate = find(channelUsers, _user => _user.id !== user.id)
        return {
          ...channel,
          mate,
          slug: mate.slug,
          name: mate.displayName,
          users: channelUsers
        }
      }

      return channel
    })
  )
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
  channelsSelector, channels => channels.filter(channel => channel.type === 'pm')
)

export const activePmsSelector = createSelector(
  pmsSelector, pms => pms.filter(pm => pm.firstMessageTime)
)

export const currentPmsSelector = createSelector(
  pmsSelector, pms => find(pms, 'current') || {}
)

export const activeUsersWithLastPmSelector = createSelector(
  [activeUsersSelector, activePmsSelector],
  (users, pms) => {
    const sortedPms = pms.sort((a, b) => a.latestMessageTime - b.latestMessageTime)
    return users.map(user => ({
      ...user,
      pm: find(sortedPms, {slug: user.slug})
    }))
  }
)

export const orgSelector = createSelector(
  state => state.org, state => state
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

export const userProfileSelector = createSelector(
  [
    currentPmsSelector
  ],
  (
    pm
  ) => {
    return {
      ...pm.mate
    }
  }
)

export const renameRoomErrorSelector = createSelector(
  state => state.renameRoomError, state => state
)

export const roomInfoSelector = createSelector(
  [
    renameRoomErrorSelector,
    channelSelector,
    userSelector
  ],
  (
    renameError,
    channel,
    user
  ) => {
    return {
      channel: channel.type === 'room' ? channel : {},
      user,
      renameError
    }
  }
)

export const sharedFilesSelector = createSelector(
  state => state.sharedFiles, state => state
)

export const mentionsSelector = createSelector(
  state => state.mentions, state => state
)

export const mentionsWithChannels = createSelector(
  [mentionsSelector, channelsSelector],
  (search, channels) => {
    return {
      ...search,
      items: search.items.map(message => {
        return {
          ...message,
          channel: find(channels, {id: message.channel})
        }
      })
    }
  }
)

export const messageSearchSelector = createSelector(
  state => state.messageSearch, state => state
)

export const messageSearchWithChannels = createSelector(
  [messageSearchSelector, channelsSelector],
  (search, channels) => {
    return {
      ...search,
      items: search.items.map(message => {
        return {
          ...message,
          channel: find(channels, {id: message.channel})
        }
      })
    }
  }
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

export const newConversationSelector = createSelector(
  state => state.newConversation, state => state
)

export const createRoomErrorSelector = createSelector(
  state => state.createRoomError, state => state
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

export const unreadMentionsAmountSelector = createSelector(
  [joinedRoomsSelector, activePmsSelector],
  (rooms, pms) => {
    return rooms
      .concat(pms)
      .filter(channel => channel.mentioned)
      .map(channel => channel.mentioned)
      .reduce((amount, mentions) => amount + mentions, 0)
  }
)

export const isInviterSelector = createSelector(
  [orgSelector, userSelector],
  ({inviterRole}, {role}) => role >= inviterRole
)

export const newConversationDialog = createSelector(
  [newConversationSelector, orgSelector, activeUsersWithLastPmSelector, isInviterSelector, createRoomErrorSelector],
  (newConversation, {id: organization}, users, isInviter, error) => ({
    ...newConversation,
    isInviter,
    organization,
    error,
    users: differenceBy(users.filter(user => !user.current), newConversation.listed, 'id')
  })
)

export const inviteDialogSelector = createSelector(
  [
    channelSelector,
    inviteChannelMemebersSelector,
    activeUsersWithLastPmSelector,
    isInviterSelector
  ],
  (
    channel,
    inviteChannelMemebers,
    allUsers,
    isInviter
  ) => {
    return {
      ...inviteChannelMemebers,
      isInviter,
      users: differenceBy(allUsers, channel.users, inviteChannelMemebers.listed, 'id'),
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

function usersAsPms(users) {
  return users.map(user => ({
    type: 'pm',
    mate: user,
    slug: user.slug,
    name: user.displayName
  }))
}

export const navigationSelector = createSelector(
  [
    joinedRoomsSelector,
    navigationPmsSelector,
    channelSelector,
    initialDataLoadingSelector,
    roomsSelector,
    activeUsersSelector
  ],
  (
    joinedRooms,
    pms,
    channel,
    isLoading,
    allRooms,
    users
  ) => {
    const all = allRooms.concat(usersAsPms(users))
    const joined = joinedRooms.concat(pms)
    const recent = joined
      .filter(_channel => !_channel.favorited)
      .sort(sortRecentChannels)
    const favorited = joined
      .filter(_channel => _channel.favorited)
      .sort((a, b) => b.favorited.order - a.favorited.order)

    return {
      joined,
      recent,
      favorited,
      isLoading,
      channel,
      unJoined: differenceBy(all, joined, 'slug')
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

export const supportSelector = createSelector(
  state => state.support, state => state
)

export const sidebarSelector = createSelector(
  state => state.sidebar, state => state
)

export const sidebarComponentSelector = createSelector(
  [
    sidebarSelector,
    roomInfoSelector,
    userProfileSelector,
    sharedFilesSelector,
    messageSearchWithChannels,
    mentionsWithChannels,
    supportSelector,
    userSelector
  ],
  (
    {show},
    room,
    pm,
    files,
    search,
    mentions,
    support,
    user
  ) => {
    const select = {
      show,
      user
    }
    if (!show) return select
    const panels = {
      room,
      pm,
      files,
      search,
      support,
      mentions: {...mentions, query: user.displayName}
    }
    return {...select, ...panels[show]}
  }
)

export const headerSelector = createSelector(
  [
    favoriteSelector, channelSelector, supportSelector, sidebarSelector,
    unreadMentionsAmountSelector, userProfileSelector
  ],
  (favorite, channel, support, {show: sidebar}, mentions, mate) => ({
    favorite, channel, support, sidebar, mentions, mate
  })
)

export const historySelector = createSelector(
  state => state.history, state => state
)

export const historyComponentSelector = createSelector(
  state => state.history, state => omit(state, 'olderMessages', 'newerMessages')
)
