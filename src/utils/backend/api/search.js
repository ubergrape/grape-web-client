import rpc from '../rpc'

export const searchUsers = ({orgId, search = '', limit}) => rpc({
  ns: 'search',
  action: 'search_users',
  args: [orgId, search, limit]
}, {camelize: true})

export const getMentions = ({id, limit, options: {showRoomMentions}, offsetDate}) => rpc({
  ns: 'search',
  action: 'get_mentions',
  args: [
    id,
    showRoomMentions ? null : 'user',
    limit,
    offsetDate
  ]
}, {camelize: true})

export const searchMessages = ({query, id, limit, offsetDate, types}) => rpc({
  ns: 'search',
  action: 'search',
  args: [
    query,
    id,
    types.join(','),
    limit,
    offsetDate
  ]
}, {camelize: true})

export const searchMessagesInChannel = ({
  query, orgId, channelId, limit, offsetDate, types
}) => rpc({
  ns: 'search',
  action: 'search_channel',
  args: [
    query,
    orgId,
    channelId,
    types.join(','),
    limit,
    offsetDate
  ]
}, {camelize: true})

export const searchFiles = ({orgId, channelId, own, limit, offset}) => rpc({
  ns: 'search',
  action: 'search_files',
  args: [
    orgId,
    channelId,
    own,
    limit,
    offset
  ]
}, {camelize: true})

export const autocomplete = (orgId, text, options = {}) => rpc({
  ns: 'search',
  action: 'autocomplete',
  args: [
    text,
    orgId,
    options.showAll || false,
    // Amount of results per section.
    15,
    // Return external services too.
    true
  ]
}, {camelize: true})