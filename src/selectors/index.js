import { createSelector } from 'reselect'
import find from 'lodash/find'
import omit from 'lodash/omit'
import * as images from '../constants/images'

export const initialDataLoadingSelector = createSelector(
  state => state.initialDataLoading.loading,
  state => state,
)

export const confSelector = createSelector(
  state => state.conf,
  state => state,
)

export const appSelector = createSelector(
  [state => state.app, initialDataLoadingSelector],
  (app, initialDataLoading) => ({
    ...app,
    initialDataLoading,
  }),
)

export const channelsSelector = createSelector(
  state => state.channels,
  state => state,
)

export const roomsSelector = createSelector(
  channelsSelector,
  channels => channels.filter(channel => channel.type === 'room'),
)

export const pmsSelector = createSelector(
  channelsSelector,
  channels => channels.filter(channel => channel.type === 'pm'),
)

export const userSelector = createSelector(
  state => state.user,
  state => state,
)

export const invitedUsersSelector = createSelector(
  pmsSelector,
  users => users.filter(user => user.isOnlyInvited),
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

export const roomDeleteSelector = createSelector(
  state => state.roomDelete,
  state => state,
)

export const joinedChannelsSelector = createSelector(
  [roomsSelector, pmsSelector],
  (rooms, pms) => Boolean(rooms.length || pms.length),
)

export const activePmsSelector = createSelector(
  pmsSelector,
  pms => pms.filter(pm => pm.lastMessage),
)

export const currentPmsSelector = createSelector(
  pmsSelector,
  pms => find(pms, 'current') || {},
)

export const invitedUsersWithPmSlector = createSelector(
  invitedUsersSelector,
  users => users.filter(user => user.pm),
)

export const orgSelector = createSelector(
  state => state.org,
  state => state,
)

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
    pmsSelector,
    orgSelector,
    channelSelector,
    typingNotificationSelector,
  ],
  (user, pms, org, channel, typingNotification) => ({
    user,
    pms,
    org,
    channel,
    typingNotification,
  }),
)

export const userProfileSelector = createSelector(
  [currentPmsSelector],
  pm => ({
    ...pm.partner,
  }),
)

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

export const alertsAndChannelSelector = createSelector(
  [alertsSelector, channelSelector],
  ({ alerts }, channel) => ({ alerts, channel }),
)

export const unreadChannelsSelector = createSelector(
  [roomsSelector, activePmsSelector, channelSelector],
  (rooms, pms, channel) => ({
    amount: rooms.concat(pms).filter(_channel => _channel.unread).length,
    channelName:
      channel.name || (channel.users && channel.users[0].displayName),
  }),
)

export const unreadMentionsAmountSelector = createSelector(
  [roomsSelector, activePmsSelector],
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
  [
    createSelector(
      state => state.newConversation,
      state => state,
    ),
  ],
  newConversation => ({
    ...newConversation,
  }),
)

export const createRoomSelector = createSelector(
  [
    createSelector(
      state => state.createRoom,
      state => state,
    ),
  ],
  createRoom => ({
    ...createRoom,
  }),
)

export const channelMembersSelector = createSelector(
  state => state.channelMembers,
  state => state,
)

export const inviteDialogSelector = createSelector(
  [
    channelSelector,
    inviteChannelMembersSelector,
    channelMembersSelector,
    isInviterSelector,
    confSelector,
  ],
  (channel, inviteChannelMembers, channelMembers, isInviter, conf) => ({
    ...inviteChannelMembers,
    users: inviteChannelMembers.users
      // Sift users which already participate in channel
      .filter(user => !channelMembers.users.some(({ id }) => id === user.id))
      // Sift users which picked to be invited
      .filter(
        user => !inviteChannelMembers.listed.some(({ id }) => id === user.id),
      ),
    isInviter,
    channel,
    conf,
  }),
)

export const inviteToOrgDialog = createSelector(
  [
    inviteToOrgSelector,
    orgSelector,
    isInviterSelector,
    channelSelector,
    confSelector,
  ],
  (inviteToOrg, { id, features }, isInviter, channel, conf) => ({
    ...inviteToOrg,
    isInviter,
    orgId: id,
    showInviteLinkFeature: Boolean(features && features.inviteLink),
    channel,
    conf,
  }),
)

export const orgInfoSelector = createSelector(
  [orgSelector, initialDataLoadingSelector, userSelector],
  ({ logo, name, inviterRole, supportLink, permissions }, isLoading, user) => ({
    logo,
    name,
    inviterRole,
    supportLink,
    permissions,
    isLoading,
    user,
  }),
)

export const navigationPmsSelector = createSelector(
  [pmsSelector],
  pms =>
    pms.filter(
      pm =>
        (pm.lastMessage && pm.lastMessage.time) ||
        pm.temporaryInNavigation ||
        pm.favorited,
    ),
)

function isoToUnixTimestamp(timestamp) {
  return new Date(timestamp).getTime()
}

function sortRecentChannels(a, b) {
  let bCompareValue
  let aCompareValue

  if (a.temporaryInNavigation) {
    aCompareValue = a.temporaryInNavigation
  } else {
    aCompareValue = a.lastMessage
      ? isoToUnixTimestamp(a.lastMessage.time)
      : isoToUnixTimestamp(a.created)
  }
  if (b.temporaryInNavigation) {
    bCompareValue = b.temporaryInNavigation
  } else {
    bCompareValue = b.lastMessage
      ? isoToUnixTimestamp(b.lastMessage.time)
      : isoToUnixTimestamp(b.created)
  }

  return bCompareValue - aCompareValue
}

export const navigationSelector = createSelector(
  [
    roomsSelector,
    navigationPmsSelector,
    channelSelector,
    initialDataLoadingSelector,
    userSelector,
    foundChannelsSelector,
    searchingChannelsSelector,
    orgSelector,
  ],
  (
    rooms,
    pms,
    channel,
    isLoading,
    user,
    foundChannels,
    searchingChannels,
    { permissions },
  ) => {
    const joined = [...rooms, ...pms]
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
      permissions,
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

export const sidebarComponentSelector = createSelector(
  [
    orgSelector,
    channelSelector,
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
    org,
    channel,
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
      channel,
      permissions: {
        ...org.permissions,
        ...channel.permissions,
      },
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
    userSelector,
  ],
  (
    history,
    { customEmojis, permissions },
    isLoading,
    isMemberOfAnyRooms,
    user,
  ) => ({
    ...omit(history, 'olderMessagesRequest', 'newerMessagesRequest'),
    customEmojis,
    permissions,
    isLoading,
    isMemberOfAnyRooms,
    user,
  }),
)

export const markdownTipsSelector = createSelector(
  state => state.markdownTips,
  state => state,
)

export const isChannelDisabledSelector = createSelector(
  [channelSelector, channelsSelector],
  (channel, channels) => {
    if (channel && Object.keys(channel).length) {
      return (
        (channel.type === 'pm' && !channel.isActive) ||
        !channel.permissions.canPostMessages
      )
    }
    return channels.length === 0 || !channel
  },
)

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
    orgSelector,
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
    { permissions },
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
    permissions,
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

export const introSelectorComponent = createSelector(
  [introSelector, orgSelector],
  (intro, { permissions }) => ({
    ...intro,
    permissions,
  }),
)
