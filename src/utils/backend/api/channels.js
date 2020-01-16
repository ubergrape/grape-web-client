import rpc from '../rpc'

export const kickMemberFromChannel = (channelId, userId) =>
  rpc({
    ns: 'channels',
    action: 'kick',
    args: [channelId, userId],
  })

export const leaveChannel = channelId =>
  rpc({
    ns: 'channels',
    action: 'leave',
    args: [channelId],
  })

export const pinMessage = (channelId, messageId) =>
  rpc({
    ns: 'channels',
    action: 'pin_message',
    args: [channelId, messageId, true],
  })

export const unpinMessage = (channelId, messageId) =>
  rpc({
    ns: 'channels',
    action: 'pin_message',
    args: [channelId, messageId, false],
  })

export const loadPinnedMessages = channelId =>
  rpc(
    {
      ns: 'channels',
      action: 'get_pinned_messages',
      args: [channelId],
    },
    { camelize: true },
  )

export const getChannel = channelId =>
  rpc(
    {
      ns: 'channels',
      action: 'get',
      args: [channelId],
    },
    { camelize: true },
  )

export const deleteChannel = (channelId, name) =>
  rpc({
    ns: 'channels',
    action: 'delete',
    args: [channelId, name],
  })

export const joinChannel = channelId =>
  rpc({
    ns: 'channels',
    action: 'join',
    args: [channelId],
  })

export const inviteToChannel = (emailAddresses, channelId) =>
  rpc({
    ns: 'channels',
    action: 'invite',
    args: [channelId, emailAddresses],
  })

export const getPinnedChannels = orgId =>
  rpc(
    {
      ns: 'channels',
      action: 'get_pins',
      args: [orgId],
    },
    { camelize: true },
  )

export const addChannelToFavorites = channelId =>
  rpc({
    ns: 'channels',
    action: 'set_pin',
    args: [channelId],
  })

export const removeChannelFromFavorites = channelId =>
  rpc({
    ns: 'channels',
    action: 'remove_pin',
    args: [channelId],
  })

export const getMessage = (channelId, messageId) =>
  rpc(
    {
      ns: 'channels',
      action: 'get_message',
      args: [channelId, messageId],
    },
    { camelize: true },
  )

export const loadLatestHistory = (channelId, limit) =>
  rpc(
    {
      ns: 'channels',
      action: 'get_history',
      args: [channelId, { limit }],
    },
    { camelize: true },
  ).then(response => ({
    messages: response,
    backendHasNewerMessages: false,
  }))

export const loadOlderHistory = (channelId, limit, timeTo) =>
  rpc(
    {
      ns: 'channels',
      action: 'get_history',
      args: [channelId, { limit, timeTo }],
    },
    { camelize: true },
  ).then(response => ({
    messages: response,
    // set to undefined since this call doesn't provide any information if
    // the backend has newer messages available for this channel
    backendHasNewerMessages: undefined,
  }))

export const loadNewerHistory = (channelId, limit, timeFrom, sort) =>
  rpc(
    {
      ns: 'channels',
      action: 'get_history',
      args: [
        channelId,
        {
          // when fetching newer messages one more is fetched to identify if there are more messages
          limit: limit + 1,
          timeFrom,
          sort,
        },
      ],
    },
    { camelize: true },
  ).then(response => ({
    messages: response.slice(0, limit),
    backendHasNewerMessages: !(response.length < limit),
  }))
/**
 * Load history at a position of specified message id.
 */
export const loadHistoryAt = (channelId, messageId, options = {}) => {
  const limit = options.limit || 50
  // Amount of messages before the passed message id.
  const before = Math.round(limit / 2)
  // Amount of messages after the passed message id.
  const after = limit - before
  // Aking for one additional entry to figure if there are more messages to load
  const afterPlusOne = after + 1
  // Return an error when message id not found, otherwise return fallback results.
  const strict = true

  return rpc(
    {
      ns: 'channels',
      action: 'focus_message',
      args: [channelId, messageId, before, afterPlusOne, strict],
    },
    { camelize: true },
  ).then(response => ({
    messages: response.slice(0, limit),
    backendHasNewerMessages: !(response.length < before + afterPlusOne),
  }))
}

export const removeMessage = (channelId, messageId) =>
  rpc({
    ns: 'channels',
    action: 'delete_message',
    args: [channelId, messageId],
  })

export const updateMessage = (channelId, messageId, text) =>
  rpc({
    ns: 'channels',
    action: 'update_message',
    args: [channelId, messageId, text],
  })

export const postMessage = (channelId, text = '', options) => {
  let optionsArg = options

  if (optionsArg.attachments) {
    optionsArg = { ...optionsArg }
    // If an id is already given, like for e.g. in case of file uploads,
    // backend expect an attachment to be the id.
    // Otherwise it expects an attachment object.
    optionsArg.attachments = optionsArg.attachments.map(attachment =>
      attachment.id ? attachment.id : attachment,
    )
  }

  return rpc({
    ns: 'channels',
    action: 'post',
    args: [channelId, text, optionsArg],
  })
}

export const readMessage = (channelId, messageId) =>
  rpc({
    ns: 'channels',
    action: 'read',
    args: [channelId, messageId],
  })

export const removeLinkAttachments = (channelId, messageId, sourceUrl, type) =>
  rpc({
    ns: 'channels',
    action: 'delete_attachment',
    args: [channelId, messageId, sourceUrl, type],
  })

export const setTyping = (channelId, isTyping) =>
  rpc({
    ns: 'channels',
    action: 'set_typing',
    args: [channelId, isTyping],
  })

export const getOverview = (
  orgId,
  { limit, excludePinned = true, olderThen = [] } = {},
) =>
  rpc(
    {
      ns: 'channels',
      action: 'get_overview',
      args: [orgId, { limit, excludePinned, olderThen }],
    },
    { camelize: true },
  ).then(response => response.channels)

export const getPinnedOverview = orgId =>
  rpc(
    {
      ns: 'channels',
      action: 'get_pinned_overview',
      args: [orgId],
    },
    { camelize: true },
  ).then(response => response.channels)
