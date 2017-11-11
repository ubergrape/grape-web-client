import {createSelector} from 'reselect'
import find from 'lodash/collection/find'
import omit from 'lodash/object/omit'
// TODO: use this from lodash 4 after
// https://github.com/ubergrape/chatgrape/issues/3326
import differenceBy from 'lodash.differenceby'
import sortBy from 'lodash/collection/sortBy'
import * as images from '../constants/images'

export const appSelector = createSelector(
  state => state.app, state => state
)

export const initialDataLoadingSelector = createSelector(
  state => state.initialDataLoading.loading, state => state
)

export const usersSelector = createSelector(
  state => state.users, state => state
)

export const activeUsersSelector = createSelector(
  usersSelector, users => users.filter(user => user.active)
)

export const invitedUsersSlector = createSelector(
  usersSelector, users => users.filter(user => user.isOnlyInvited)
)

export const deletedUsersSelector = createSelector(
  usersSelector, users => users.filter(user => !user.active)
)

export const userSelector = createSelector(
  usersSelector, users => find(users, 'current') || {}
)

export const initialChannelsSelector = createSelector(
  state => state.channels, state => state
)

export const otherActiveUsersSelector = createSelector(
  activeUsersSelector, users => users.filter(user => !user.current)
)

/**
 * Fill the `initialChannelsSelector` with user objects
 * instead of user ID's.
 */
export const channelsSelector = createSelector(
  [initialChannelsSelector, usersSelector, userSelector],
  (channels, users, user) => (
    channels.map((channel) => {
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

export const roomDeleteSelector = createSelector(
  state => state.roomDelete, state => state
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

export const invitedUsersWithPmSlector = createSelector(
  invitedUsersSlector, users => users.filter(user => user.pm)
)

export const deletedUsersWithPmSelector = createSelector(
  deletedUsersSelector, users => users.filter(user => user.pm)
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
  (channels, channel) => ({channels, channel})
)

export const setTypingSelector = createSelector(
  [
    userSelector,
    usersSelector,
    channelSelector,
    typingNotificationSelector
  ],
  (user, users, channel, typingNotification) => ({
    user,
    users,
    channel,
    typingNotification
  })
)

export const userProfileSelector = createSelector(
  [currentPmsSelector],
  pm => ({...pm.mate})
)

const notificationSettingsSelector = createSelector(
  state => state.notificationSettings, state => state
)

export const notificationSettingsComponentSelector = createSelector(
  [userSelector, notificationSettingsSelector],
  (user, notificationSettings) => ({user, ...notificationSettings})
)

export const renameRoomErrorSelector = createSelector(
  state => state.renameRoomError, state => state
)

export const roomInfoSelector = createSelector(
  [
    renameRoomErrorSelector,
    channelSelector,
    userSelector,
    notificationSettingsSelector
  ],
  (renameError, channel, user, notificationSettings) => ({
    channel: channel.type === 'room' ? channel : {},
    user,
    renameError,
    notificationSettings
  })
)

export const sharedFilesSelector = createSelector(
  state => state.sharedFiles, state => state
)

export const mentionsSelector = createSelector(
  state => state.mentions, state => state
)

export const mentionsWithChannels = createSelector(
  [mentionsSelector, channelsSelector, orgSelector],
  (search, channels, {customEmojis}) => ({
    ...search,
    customEmojis,
    items: search.items.map(message => ({
      ...message,
      channel: find(channels, {id: message.channelId})
    }))
  })
)

export const messageSearchSelector = createSelector(
  state => state.messageSearch, state => state
)

export const messageSearchWithChannels = createSelector(
  [messageSearchSelector, channelsSelector, orgSelector],
  (search, channels, {customEmojis}) => ({
    ...search,
    customEmojis,
    items: search.items.map(message => ({
      ...message,
      channel: find(channels, {id: message.channelId})
    }))
  })
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

export const inviteToOrgSelector = createSelector(
  state => state.inviteToOrg, state => state
)

export const createRoomErrorSelector = createSelector(
  state => state.createRoomError, state => state
)

export const alertsAndChannelSelector = createSelector(
  [alertsSelector, channelSelector],
  ({alerts}, channel) => ({alerts, channel})
)

export const unreadChannelsSelector = createSelector(
  [joinedRoomsSelector, activePmsSelector, channelSelector],
  (rooms, pms, channel) => ({
    amount: rooms.concat(pms).filter(_channel => _channel.unread).length,
    channelName: channel.name || (channel.users && channel.users[0].displayName)
  })
)

export const unreadMentionsAmountSelector = createSelector(
  [joinedRoomsSelector, activePmsSelector],
  (rooms, pms) => (
    rooms
      .concat(pms)
      .filter(channel => channel.mentioned)
      .map(channel => channel.mentioned)
      .reduce((amount, mentions) => amount + mentions, 0)
  )
)

export const isInviterSelector = createSelector(
  [orgSelector, userSelector],
  ({inviterRole}, {role}) => (role >= inviterRole)
)

export const newConversationDialog = createSelector(
  [
    newConversationSelector, orgSelector, activeUsersWithLastPmSelector,
    isInviterSelector, createRoomErrorSelector
  ],
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
  (channel, inviteChannelMemebers, allUsers, isInviter) => ({
    ...inviteChannelMemebers,
    isInviter,
    users: differenceBy(allUsers, channel.users, inviteChannelMemebers.listed, 'id'),
    channelType: channel.type
  })
)

export const inviteToOrgDialog = createSelector(
  [inviteToOrgSelector, orgSelector, isInviterSelector],
  (inviteToOrg, {id, features}, isInviter) => ({
    ...inviteToOrg,
    isInviter,
    orgId: id,
    showInviteLinkFeature: Boolean(features && features.inviteLink)
  })
)

export const orgInfoSelector = createSelector(
  [orgSelector, initialDataLoadingSelector, userSelector],
  (org, isLoading, user) => ({
    logo: org.logo,
    name: org.name,
    inviterRole: org.inviterRole,
    isLoading,
    user
  })
)

export const navigationPmsSelector = createSelector(
  [pmsSelector],
  pms => (
    pms.filter(pm => (
      pm.firstMessageTime || pm.temporaryInNavigation || pm.favorited
    ))
  )
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
    activeUsersSelector,
    userSelector
  ],
  (joinedRooms, pms, channel, isLoading, allRooms, users, user) => {
    const all = [...allRooms, ...usersAsPms(users)]
    const joined = [...joinedRooms, ...pms]
    const unjoined = differenceBy(all, joined, 'slug')
      .filter(({slug}) => slug !== user.slug)
    const recent = joined
      .filter(_channel => !_channel.favorited)
      .sort(sortRecentChannels)
    const favorited = joined
      .filter(_channel => _channel.favorited)
      .sort((a, b) => b.favorited.order - a.favorited.order)

    return {
      joined,
      unjoined,
      recent,
      favorited,
      isLoading,
      channel
    }
  }
)

export const favoriteSelector = createSelector(
  channelSelector,
  ({favorited, id}) => ({
    favorited: Boolean(favorited),
    id
  })
)

export const sidebarSelector = createSelector(
  state => state.sidebar, state => state
)

export const labeledMessagesSelector = createSelector(
  state => state.labeledMessages, state => state
)

export const sidebarComponentSelector = createSelector(
  [
    sidebarSelector,
    roomInfoSelector,
    userProfileSelector,
    sharedFilesSelector,
    messageSearchWithChannels,
    mentionsWithChannels,
    userSelector,
    labeledMessagesSelector
  ],
  ({show, showSubview}, room, pm, files, search, mentions, user, labeledMessages) => {
    const select = {show, showSubview, user}

    if (!show) return select

    const views = {
      room,
      pm,
      search,
      mentions: {
        ...mentions,
        query: user.displayName
      },
      labeledMessages
    }

    const subviews = {
      files
    }

    return {
      ...select,
      ...views[show],
      subview: subviews[showSubview]
    }
  }
)

export const headerSelector = createSelector(
  [
    orgSelector, favoriteSelector, channelSelector, sidebarSelector,
    unreadMentionsAmountSelector, userProfileSelector
  ],
  ({features}, favorite, channel, {show: sidebar}, mentions, mate) => ({
    favorite, channel, sidebar, mentions, mate, features
  })
)

export const historySelector = createSelector(
  state => state.history, state => state
)

export const historyComponentSelector = createSelector(
  [historySelector, orgSelector],
  (history, {customEmojis}) => ({
    ...omit(history, 'olderMessages', 'newerMessages'),
    customEmojis
  })
)

export const markdownTipsSelector = createSelector(
  state => state.markdownTips, state => state
)

export const isChannelDisabledSelector = createSelector(
  [channelSelector, channelsSelector],
  (channel, channels) => channels.length === 0 ||
    !channel || (channel.type === 'pm' && !channel.users[0].active)
)

export const footerSelector = createSelector(
  state => state.footer, state => state
)

export const footerComponentSelector = createSelector(
  [
    typingNotificationSelector,
    footerSelector,
    orgSelector,
    historySelector,
    otherActiveUsersSelector,
    roomsSelector,
    isChannelDisabledSelector
  ],
  (typingNotification, footer, org, history, users, rooms, isChannelDisabled) => ({
    ...typingNotification,
    ...footer,
    targetMessage: find(history.messages, {id: footer.targetMessage}),
    customEmojis: org.customEmojis,
    images: {...images, orgLogo: org.logo},
    users,
    rooms,
    disabled: isChannelDisabled
  })
)

export const soundsSelector = createSelector(
  state => state.sounds, state => state
)

export const toastNotificationSelector = createSelector(
  [state => state.toastNotification, sidebarSelector],
  (toastNotification, sidebar) => ({...toastNotification, sidebar: sidebar.show})
)

export const manageContactsSelector = createSelector(
  [
    state => state.manageContacts,
    activeUsersSelector, invitedUsersWithPmSlector, deletedUsersWithPmSelector
  ],
  ({show, activeFilter}, allActiveUsers, invitedUsers, deletedUsers) => {
    const activeUsers = allActiveUsers.filter(user => !user.current)
    const contacts = {
      active: activeUsers,
      invited: invitedUsers,
      deleted: deletedUsers
    }
    const users = sortBy(contacts[activeFilter] || [], 'displayName')

    return {
      show,
      activeFilter,
      users
    }
  }
)

export const fileUploadSelector = createSelector(
  state => state.fileUpload, state => state
)

export const manageGroupsSelector = createSelector(
  [
    state => state.manageGroups,
    roomsSelector,
    joinedRoomsSelector
  ],
  ({show, activeFilter}, allRooms, joinedRooms) => {
    const unsorted = (
      activeFilter === 'joined' ?
        joinedRooms :
        differenceBy(allRooms, joinedRooms, 'id')
    )

    const groups = sortBy(unsorted, 'name')
      .map((group) => {
        const creatorUser = group.users.filter(
          user => user.id === group.creator
        )[0]
        return {
          ...group,
          creatorUser
        }
      })

    return {
      show,
      activeFilter,
      groups
    }
  }
)

export const linkAttachmentsSelector = createSelector(
  state => state.linkAttachments, state => state
)

export const browserNotificationSelector = createSelector(
  state => state.browserNotification, state => state
)

export const introSelector = createSelector(
  state => state.intro, state => state
)
