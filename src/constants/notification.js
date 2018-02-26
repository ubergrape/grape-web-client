export const dispatchers = {
  all: ['message', 'pm', 'mention', 'group_mention', 'room_invite', 'activity'],
  mentions: ['mention', 'group_mention'],
  invites: ['room_invite']
}

// All available transports.
export const transports = ['desktop', 'push', 'email']
