import { createSelector } from 'reselect'
import find from 'lodash/find'
import omit from 'lodash/omit'
import * as images from '../constants/images'

export const initialDataLoadingSelector = createSelector(
  state => state.initialDataLoading.loading,
  state => state,
)

export const appSelector = createSelector(
  [state => state.app, initialDataLoadingSelector],
  (app, initialDataLoading) => ({
    ...app,
    initialDataLoading,
  }),
)

/**
 * state.users is not necessarily a list of all users in the organisation
 * since it gets filled by pm objects from pm get_overview
 * https://uebergrape.staging.chatgrape.com/doc/chat_api/rpc.html#chat.rpc.PM.get_overview
 */
export const usersSelector = createSelector(
  state => state.users,
  state => state,
)

export const userSelector = createSelector(state => state.user, state => state)

export const activeUsersSelector = createSelector(usersSelector, users =>
  users.filter(user => user.isActive),
)

export const invitedUsersSelector = createSelector(usersSelector, users =>
  users.filter(user => user.isOnlyInvited),
)

export const deletedUsersSelector = createSelector(usersSelector, users =>
  users.filter(user => !user.isActive),
)

export const initialChannelsSelector = createSelector(
  state => state.channels,
  state => state,
)

/**
 * Fill the `initialChannelsSelector` with pm objects
 * instead of pm ID's.
 */
export const channelsSelector = createSelector(
  [initialChannelsSelector, usersSelector],
  (channels, users) =>
    channels
      .map(channel => {
        if (channel.type === 'room') {
          return {
            ...channel,
            users: channel.users,
          }
        }

        if (channel.type === 'pm') {
          const user = find(users, _user => _user.id === channel.id)
          if (!user) return null
          return {
            ...user,
            ...channel,
            name: user.partner.displayName,
            users: channel.users,
          }
        }

        return channel
        // TODO remove it once no logic left which assumes we have all channels and users.
        // Handles pm channels when mate user was not found in `users`.
      })
      .filter(Boolean),
)

export const channelSelector = createSelector(
  channelsSelector,
  channels => find(channels, 'current') || {},
)

export const channelsToMentionSelector = createSelector(
  state => state.footer.channelsToMention,
  state => state,
)

export const foundChannelsSelector = createSelector(
  state => state.navigation.foundChannels,
  state => state,
)

export const searchingChannelsSelector = createSelector(
  state => state.navigation.searchingChannels,
  state => state,
)

export const roomsSelector = createSelector(channelsSelector, channels =>
  channels.filter(channel => channel.type === 'room'),
)

export const joinedRoomsSelector = createSelector(roomsSelector, rooms =>
  rooms.filter(room => room.joined),
)

export const roomDeleteSelector = createSelector(
  state => state.roomDelete,
  state => state,
)

export const pmsSelector = createSelector(channelsSelector, channels =>
  channels.filter(channel => channel.type === 'pm'),
)

export const joinedChannelsSelector = createSelector(
  [joinedRoomsSelector, pmsSelector],
  (joinedRooms, pms) => Boolean(joinedRooms.length || pms.length),
)

export const activePmsSelector = createSelector(pmsSelector, pms =>
  pms.filter(pm => pm.firstMessageTime),
)

export const currentPmsSelector = createSelector(
  pmsSelector,
  pms => find(pms, 'current') || {},
)

export const invitedUsersWithPmSlector = createSelector(
  invitedUsersSelector,
  users => users.filter(user => user.pm),
)

export const deletedUsersWithPmSelector = createSelector(
  deletedUsersSelector,
  users => users.filter(user => user.pm),
)

export const orgSelector = createSelector(state => state.org, state => state)

export const billingWarningSelector = createSelector(
  state => state.billingWarning,
  state => state,
)

export const typingChannelsSelector = createSelector(
  state => state.typingChannels,
  state => state,
)

export const typingNotificationSelector = createSelector(
  [typingChannelsSelector, channelSelector],
  (channels, channel) => ({ channels, channel }),
)

export const setTypingSelector = createSelector(
  [
    userSelector,
    usersSelector,
    orgSelector,
    channelSelector,
    typingNotificationSelector,
  ],
  (user, users, org, channel, typingNotification) => ({
    user,
    users,
    org,
    channel,
    typingNotification,
  }),
)

export const userProfileSelector = createSelector([currentPmsSelector], pm => ({
  ...pm.partner,
}))

const notificationSettingsSelector = createSelector(
  state => state.notificationSettings,
  state => state,
)

export const notificationSettingsComponentSelector = createSelector(
  [userSelector, notificationSettingsSelector],
  (user, notificationSettings) => ({ user, ...notificationSettings }),
)

export const renameRoomErrorSelector = createSelector(
  state => state.renameRoomError,
  state => state,
)

export const roomInfoSelector = createSelector(
  [
    renameRoomErrorSelector,
    channelSelector,
    userSelector,
    notificationSettingsSelector,
  ],
  (renameError, channel, user, notificationSettings) => ({
    channel: channel.type === 'room' ? channel : {},
    user,
    renameError,
    notificationSettings,
  }),
)

export const sharedFilesSelector = createSelector(
  state => state.sharedFiles,
  state => state,
)

export const mentionsSelector = createSelector(
  state => state.mentions,
  state => state,
)

export const mentionsWithChannels = createSelector(
  [mentionsSelector, channelsSelector, orgSelector],
  (search, channels, { customEmojis }) => ({
    ...search,
    customEmojis,
    items: search.items.map(message => ({
      ...message,
      channel: find(channels, { id: message.channelId }),
    })),
  }),
)

export const messageSearchSelector = createSelector(
  state => state.messageSearch,
  state => state,
)

export const messageSearchWithChannels = createSelector(
  [messageSearchSelector, channelsSelector, orgSelector],
  (search, channels, { customEmojis }) => ({
    ...search,
    customEmojis,
    items: search.items.map(message => ({
      ...message,
      channel: find(channels, { id: message.channelId }),
    })),
  }),
)

export const alertsSelector = createSelector(
  state => state.alerts,
  state => state,
)

export const inviteChannelMembersSelector = createSelector(
  state => state.inviteChannelMembers,
  state => state,
)

export const inviteToOrgSelector = createSelector(
  state => state.inviteToOrg,
  state => state,
)

export const createRoomErrorSelector = createSelector(
  state => state.createRoomError,
  state => state,
)

export const alertsAndChannelSelector = createSelector(
  [alertsSelector, channelSelector],
  ({ alerts }, channel) => ({ alerts, channel }),
)

export const unreadChannelsSelector = createSelector(
  [joinedRoomsSelector, activePmsSelector, channelSelector],
  (rooms, pms, channel) => ({
    amount: rooms.concat(pms).filter(_channel => _channel.unread).length,
    channelName:
      channel.name || (channel.users && channel.users[0].displayName),
  }),
)

export const unreadMentionsAmountSelector = createSelector(
  [joinedRoomsSelector, activePmsSelector],
  (rooms, pms) =>
    rooms
      .concat(pms)
      .filter(channel => channel.mentioned)
      .map(channel => channel.mentioned)
      .reduce((amount, mentions) => amount + mentions, 0),
)

export const isInviterSelector = createSelector(
  [orgSelector, userSelector],
  ({ inviterRole }, { role }) => role >= inviterRole,
)

export const newConversationSelector = createSelector(
  [createSelector(state => state.newConversation, state => state)],
  newConversation => ({
    ...newConversation,
  }),
)

export const inviteDialogSelector = createSelector(
  [channelSelector, inviteChannelMembersSelector, isInviterSelector],
  (channel, inviteChannelMembers, isInviter) => ({
    ...inviteChannelMembers,
    users: inviteChannelMembers.users
      // Sift users which already participate in channel
      .filter(user => !channel.users.some(id => id === user.id))
      // Sift users which picked to be invited
      .filter(
        user => !inviteChannelMembers.listed.some(({ id }) => id === user.id),
      ),
    isInviter,
    channelType: channel.type,
  }),
)

export const inviteToOrgDialog = createSelector(
  [inviteToOrgSelector, orgSelector, isInviterSelector],
  (inviteToOrg, { id, features }, isInviter) => ({
    ...inviteToOrg,
    isInviter,
    orgId: id,
    showInviteLinkFeature: Boolean(features && features.inviteLink),
  }),
)

export const orgInfoSelector = createSelector(
  [orgSelector, initialDataLoadingSelector, userSelector],
  ({ logo, name, inviterRole, supportLink }, isLoading, user) => ({
    logo,
    name,
    inviterRole,
    supportLink,
    isLoading,
    user,
  }),
)

export const navigationPmsSelector = createSelector([pmsSelector], pms =>
  pms.filter(
    pm => pm.firstMessageTime || pm.temporaryInNavigation || pm.favorited,
  ),
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
    navigationPmsSelector,
    channelSelector,
    initialDataLoadingSelector,
    userSelector,
    foundChannelsSelector,
    searchingChannelsSelector,
  ],
  (
    joinedRooms,
    pms,
    channel,
    isLoading,
    user,
    foundChannels,
    searchingChannels,
  ) => {
    const joined = [...joinedRooms, ...pms].filter(({ id }) => id !== user.id)
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
      foundChannels,
      searchingChannels,
    }
  },
)

export const favoriteSelector = createSelector(
  channelSelector,
  ({ favorited, id }) => ({
    favorited: Boolean(favorited),
    id,
  }),
)

export const sidebarSelector = createSelector(
  state => state.sidebar,
  state => state,
)

export const labeledMessagesSelector = createSelector(
  state => state.labeledMessages,
  state => state,
)

export const pinnedMessagesSelector = createSelector(
  state => state.pinnedMessages,
  state => state,
)

export const channelMembersSelector = createSelector(
  state => state.channelMembers,
  state => state,
)

export const sidebarComponentSelector = createSelector(
  [
    sidebarSelector,
    roomInfoSelector,
    userProfileSelector,
    sharedFilesSelector,
    channelMembersSelector,
    messageSearchWithChannels,
    mentionsWithChannels,
    userSelector,
    labeledMessagesSelector,
    pinnedMessagesSelector,
  ],
  (
    { show, showSubview },
    room,
    pm,
    files,
    members,
    search,
    mentions,
    user,
    labeledMessages,
    pinnedMessages,
  ) => {
    const select = { show, showSubview, user }

    if (!show) return select

    const views = {
      room,
      pm,
      search,
      mentions: {
        ...mentions,
        query: user.displayName,
      },
      labeledMessages,
    }

    const subviews = {
      files,
      pinnedMessages,
      members,
    }

    return {
      ...select,
      ...views[show],
      subview: subviews[showSubview],
    }
  },
)

export const headerSelector = createSelector(
  [
    orgSelector,
    favoriteSelector,
    channelSelector,
    sidebarSelector,
    unreadMentionsAmountSelector,
    userProfileSelector,
    joinedChannelsSelector,
  ],
  (
    { features },
    favorite,
    channel,
    { show: sidebar },
    mentions,
    partner,
    isMemberOfAnyRooms,
  ) => ({
    favorite,
    channel,
    sidebar,
    mentions,
    partner,
    features,
    isMemberOfAnyRooms,
  }),
)

export const historySelector = createSelector(
  state => state.history,
  state => state,
)

export const historyComponentSelector = createSelector(
  [
    historySelector,
    orgSelector,
    initialDataLoadingSelector,
    joinedChannelsSelector,
  ],
  (history, { customEmojis }, isLoadingInitialData, isMemberOfAnyRooms) => ({
    ...omit(history, 'olderMessagesRequest', 'newerMessagesRequest'),
    customEmojis,
    isLoadingInitialData,
    isMemberOfAnyRooms,
  }),
)

export const markdownTipsSelector = createSelector(
  state => state.markdownTips,
  state => state,
)

export const isChannelDisabledSelector = createSelector(
  [channelSelector, channelsSelector],
  (channel, channels) => {
    if (channel) return channel.type === 'pm' && !channel.isActive
    return channels.length === 0 || !channel
  },
)

export const confSelector = createSelector(state => state.conf, state => state)

export const footerSelector = createSelector(
  state => state.footer,
  state => state,
)

export const footerComponentSelector = createSelector(
  [
    typingNotificationSelector,
    footerSelector,
    orgSelector,
    historySelector,
    isChannelDisabledSelector,
    channelsToMentionSelector,
    joinedChannelsSelector,
    confSelector,
  ],
  (
    typingNotification,
    footer,
    org,
    history,
    isChannelDisabled,
    channelsToMention,
    isMemberOfAnyRooms,
    conf,
  ) => ({
    ...typingNotification,
    ...footer,
    org,
    targetMessage: find(history.messages, { id: footer.targetMessage }),
    customEmojis: org.customEmojis,
    images: { ...images, orgLogo: org.logo },
    disabled: isChannelDisabled,
    channelsToMention,
    isMemberOfAnyRooms,
    conf,
  }),
)

export const soundsSelector = createSelector(
  state => state.sounds,
  state => state,
)

export const toastNotificationSelector = createSelector(
  [state => state.toastNotification, sidebarSelector],
  (toastNotification, sidebar) => ({
    ...toastNotification,
    sidebar: sidebar.show,
  }),
)

export const fileUploadSelector = createSelector(
  state => state.fileUpload,
  state => state,
)

export const fileUploadComponentSelector = createSelector(
  [fileUploadSelector, isChannelDisabledSelector],
  (fileUpload, disabled) => ({
    ...fileUpload,
    disabled,
  }),
)

export const linkAttachmentsSelector = createSelector(
  state => state.linkAttachments,
  state => state,
)

export const browserNotificationSelector = createSelector(
  state => state.browserNotification,
  state => state,
)

export const introSelector = createSelector(
  state => state.intro,
  state => state,
)
