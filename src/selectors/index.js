import { createSelector } from 'reselect'
import find from 'lodash/find'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
// TODO: use this from lodash 4 after
// https://github.com/ubergrape/chatgrape/issues/3326
import differenceBy from 'lodash/differenceBy'
import * as images from '../constants/images'

export const initialDataLoadingSelector = createSelector(
  state => state.initialDataLoading.loading,
  state => state,
)

export const confSelector = createSelector(
  state => state.conf,
  state => state,
)

export const userSelector = createSelector(
  state => state.user,
  state => state,
)

export const channelsSelector = createSelector(
  state => state.channels,
  state => state,
)

const channelsToMentionSelector = createSelector(
  state => state.footer.channelsToMention,
  state => state,
)

const foundChannelsSelector = createSelector(
  state => state.navigation.foundChannels,
  state => state,
)

const searchingChannelsSelector = createSelector(
  state => state.navigation.searchingChannels,
  state => state,
)

export const roomDeleteSelector = createSelector(
  state => state.roomDelete,
  state => state,
)

export const orgSelector = createSelector(
  state => state.org,
  state => state,
)

export const billingWarningSelector = createSelector(
  state => state.billingWarning,
  state => state,
)

const typingChannelsSelector = createSelector(
  state => state.typingChannels,
  state => state,
)

const notificationSettingsSelector = createSelector(
  state => state.notificationSettings,
  state => state,
)

const renameRoomErrorSelector = createSelector(
  state => state.renameRoomError,
  state => state,
)

export const sharedFilesSelector = createSelector(
  state => state.sharedFiles,
  state => state,
)

export const mentionsSelector = createSelector(
  state => state.mentions,
  state => state,
)

export const sidebarSelector = createSelector(
  state => state.sidebar,
  state => state,
)

export const labeledMessagesSelector = createSelector(
  state => state.labeledMessages,
  state => state,
)

const pinnedMessagesSelector = createSelector(
  state => state.pinnedMessages,
  state => state,
)

export const channelMembersSelector = createSelector(
  state => state.channelMembers,
  state => state,
)

export const messageSearchSelector = createSelector(
  state => state.messageSearch,
  state => state,
)

export const alertsSelector = createSelector(
  state => state.alerts,
  state => state,
)

const inviteChannelMembersSelector = createSelector(
  state => state.inviteChannelMembers,
  state => state,
)

const inviteToOrgSelector = createSelector(
  state => state.inviteToOrg,
  state => state,
)

const createRoomErrorSelector = createSelector(
  state => state.createRoomError,
  state => state,
)

const reconnectSelector = createSelector(
  state => state.reconnect,
  state => state,
)

export const historySelector = createSelector(
  state => state.history,
  state => state,
)

export const soundsSelector = createSelector(
  state => state.sounds,
  state => state,
)

const fileUploadSelector = createSelector(
  state => state.fileUpload,
  state => state,
)

export const manageGroupsSelector = createSelector(
  state => state.manageGroups,
  state => state,
)

export const linkAttachmentsSelector = createSelector(
  state => state.linkAttachments,
  state => state,
)

const browserNotificationSelector = createSelector(
  state => state.browserNotification,
  state => state,
)

export const incomingCallSelector = createSelector(
  state => state.incomingCall,
  state => state,
)

const videoConferenceWarningSelector = createSelector(
  state => state.videoConferenceWarning,
  state => state,
)

const callStatusSelector = createSelector(
  state => state.callStatus,
  state => state,
)

export const markdownTipsSelector = createSelector(
  state => state.markdownTips,
  state => state,
)

const introSelector = createSelector(
  state => state.intro,
  state => state,
)

const footerSelector = createSelector(
  state => state.footer,
  state => state,
)

const leaveChannelSelector = createSelector(
  state => state.leaveChannel,
  state => state,
)

export const appSelector = createSelector(
  [state => state.app, initialDataLoadingSelector],
  (app, initialDataLoading) => ({
    ...app,
    initialDataLoading,
  }),
)

export const pmsSelector = createSelector(channelsSelector, channels =>
  channels.filter(channel => channel.type === 'pm'),
)

export const roomsSelector = createSelector(channelsSelector, channels =>
  channels.filter(channel => channel.type === 'room'),
)

export const joinedChannelsSelector = createSelector(
  [channelsSelector],
  channels => Boolean(channels.length),
)

export const activePmsSelector = createSelector(pmsSelector, pms =>
  pms.filter(pm => pm.lastMessageTime),
)

export const channelSelector = createSelector(
  channelsSelector,
  channels => find(channels, 'current') || {},
)

export const currentPmsSelector = createSelector(
  pmsSelector,
  pms => find(pms, 'current') || {},
)

const userProfileSelector = createSelector([currentPmsSelector], pm => ({
  ...pm.partner,
}))

export const notificationSettingsComponentSelector = createSelector(
  [userSelector, notificationSettingsSelector],
  (user, notificationSettings) => ({ user, ...notificationSettings }),
)

const roomInfoSelector = createSelector(
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

const mentionsWithChannels = createSelector(
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

const messageSearchWithChannels = createSelector(
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

const newConversationSelector = createSelector(
  [
    state => state.newConversation,
    joinedChannelsSelector,
    channelSelector,
    confSelector,
    orgSelector,
  ],
  (
    newConversation,
    isMemberOfAnyRooms,
    channel,
    { organization: { colors } },
    { defaults },
  ) => ({
    ...newConversation,
    isMemberOfAnyRooms,
    channel,
    colors,
    defaults,
  }),
)

export const alertsAndChannelSelector = createSelector(
  [alertsSelector, channelSelector, reconnectSelector],
  ({ alerts }, channel, reconnect) => ({ alerts, channel, reconnect }),
)

export const unreadChannelsSelector = createSelector(
  [roomsSelector, activePmsSelector, channelSelector],
  (rooms, pms, channel) => ({
    amount: rooms.concat(pms).filter(_channel => _channel.unread).length,
    channel,
  }),
)

const unreadMentionsAmountSelector = createSelector(
  [roomsSelector, activePmsSelector],
  (rooms, pms) =>
    rooms
      .concat(pms)
      .filter(channel => channel.mentions)
      .map(channel => channel.mentions)
      .reduce((amount, mentions) => amount + mentions, 0),
)

const isInviterSelector = createSelector(
  [orgSelector, userSelector],
  ({ inviterRole }, { role }) => role >= inviterRole,
)

export const newConversationComponentSelector = createSelector(
  [
    newConversationSelector,
    orgSelector,
    isInviterSelector,
    createRoomErrorSelector,
  ],
  (newConversation, { id: organization }, isInviter, error) => ({
    ...newConversation,
    isInviter,
    organization,
    error,
    users: differenceBy(newConversation.found, newConversation.listed, 'id'),
  }),
)

export const inviteDialogSelector = createSelector(
  [
    channelSelector,
    channelMembersSelector,
    inviteChannelMembersSelector,
    isInviterSelector,
    confSelector,
  ],
  (channel, channelMembers, inviteChannelMembers, isInviter, conf) => ({
    ...inviteChannelMembers,
    users: inviteChannelMembers.users
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
  [orgSelector, initialDataLoadingSelector, userSelector, confSelector],
  (
    { logo, name, inviterRole, supportLink, permissions },
    isLoading,
    user,
    { organization: { colors } },
  ) => ({
    logo,
    name,
    inviterRole,
    supportLink,
    permissions,
    isLoading,
    user,
    colors,
  }),
)

const unixToIsoTime = timestamp =>
  timestamp ? new Date(timestamp).getTime() : null

const sortRecentChannels = (a, b) => {
  let bCompareValue
  let aCompareValue

  if (a.temporaryInNavigation) {
    aCompareValue = a.temporaryInNavigation
  } else if (a.lastMessageTime) {
    aCompareValue = unixToIsoTime(a.lastMessageTime)
  } else {
    aCompareValue = unixToIsoTime(a.created)
  }

  if (b.temporaryInNavigation) {
    bCompareValue = b.temporaryInNavigation
  } else if (b.lastMessageTime) {
    bCompareValue = unixToIsoTime(b.lastMessageTime)
  } else {
    bCompareValue = unixToIsoTime(b.created)
  }

  return bCompareValue - aCompareValue
}

export const navigationSelector = createSelector(
  [
    channelsSelector,
    channelSelector,
    initialDataLoadingSelector,
    userSelector,
    foundChannelsSelector,
    searchingChannelsSelector,
    confSelector,
    orgSelector,
  ],
  (
    channels,
    channel,
    isLoading,
    user,
    foundChannels,
    searchingChannels,
    { organization: { colors } },
    { permissions },
  ) => {
    const recent = channels
      .filter(_channel => !_channel.favorited)
      .sort(sortRecentChannels)

    const favorited = channels
      .filter(_channel => _channel.favorited)
      .sort((a, b) => b.favorited.order - a.favorited.order)

    return {
      channels,
      recent,
      favorited,
      isLoading,
      channel,
      foundChannels,
      searchingChannels,
      colors,
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
    confSelector,
  ],
  (
    { permissions, customEmojis },
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
    { organization: { colors } },
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
        ...permissions,
        ...channel.permissions,
      },
      customEmojis,
      subview: subviews[showSubview],
      colors,
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
    confSelector,
    userSelector,
  ],
  (
    { permissions },
    favorite,
    channel,
    { show: sidebar },
    mentions,
    partner,
    isMemberOfAnyRooms,
    { organization: { colors } },
    user,
  ) => ({
    favorite,
    channel,
    sidebar,
    mentions,
    partner,
    permissions: {
      ...permissions,
      ...channel.permissions,
    },
    isMemberOfAnyRooms,
    colors,
    user,
  }),
)

export const historyComponentSelector = createSelector(
  [
    historySelector,
    channelSelector,
    orgSelector,
    initialDataLoadingSelector,
    joinedChannelsSelector,
    userSelector,
    pmsSelector,
    confSelector,
  ],
  (
    history,
    channel,
    org,
    isLoading,
    isMemberOfAnyRooms,
    user,
    users,
    conf,
  ) => ({
    ...omit(history, 'olderMessagesRequest', 'newerMessagesRequest'),
    customEmojis: org.customEmojis,
    permissions: {
      ...org.permissions,
      ...channel.permissions,
    },
    channel: pick(channel, [
      'id',
      'isPublic',
      'creator',
      'name',
      'type',
      'partner',
    ]),
    isLoading,
    isMemberOfAnyRooms,
    user,
    users,
    colors: conf.organization.colors,
    conf,
  }),
)

export const isPostingLimitedSelector = createSelector(
  [channelSelector, channelsSelector],
  (channel, channels) => {
    if (channel && Object.keys(channel).length)
      return !channel.permissions.canPostMessages
    return channels.length === 0 || !channel
  },
)

export const footerComponentSelector = createSelector(
  [
    footerSelector,
    typingChannelsSelector,
    channelSelector,
    orgSelector,
    historySelector,
    isPostingLimitedSelector,
    channelsToMentionSelector,
    joinedChannelsSelector,
    confSelector,
    orgSelector,
  ],
  (
    footer,
    typingChannels,
    channel,
    org,
    history,
    isPostingLimited,
    channelsToMention,
    isMemberOfAnyRooms,
    conf,
    { permissions },
  ) => ({
    ...footer,
    typingChannels,
    channel,
    org,
    targetMessage: find(history.messages, { id: footer.targetMessage }),
    customEmojis: org.customEmojis,
    images: { ...images, orgLogo: org.logo },
    isPostingLimited,
    channelsToMention,
    isMemberOfAnyRooms,
    conf,
    permissions,
  }),
)

export const toastNotificationSelector = createSelector(
  [state => state.toastNotification, sidebarSelector],
  (toastNotification, sidebar) => ({
    ...toastNotification,
    sidebar: sidebar.show,
  }),
)

export const fileUploadComponentSelector = createSelector(
  [fileUploadSelector, isPostingLimitedSelector],
  (fileUpload, isPostingLimited) => ({
    ...fileUpload,
    disabled: isPostingLimited,
  }),
)

export const browserNotificationComponentSelector = createSelector(
  [
    browserNotificationSelector,
    channelSelector,
    confSelector,
    incomingCallSelector,
  ],
  (browserNotification, channel, conf, incomingCall) => ({
    ...browserNotification,
    conf,
    channel,
    incomingCall,
  }),
)

export const introComponentSelector = createSelector(
  [introSelector, orgSelector],
  (intro, { permissions }) => ({
    ...intro,
    permissions,
  }),
)

export const videoConferenceWarningComponentSelector = createSelector(
  [videoConferenceWarningSelector, channelSelector],
  (videoConferenceWarning, { grapecallUrl }) => ({
    ...videoConferenceWarning,
    grapecallUrl,
  }),
)

export const callStatusComponentSelector = createSelector(
  [callStatusSelector, userSelector],
  (callStatus, user) => ({
    callStatus,
    user,
  }),
)

export const leaveChannelComponentSelector = createSelector(
  [leaveChannelSelector, channelSelector],
  (leaveChannel, channel) => ({
    ...leaveChannel,
    channel,
  }),
)
