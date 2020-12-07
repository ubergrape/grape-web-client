export const dispatchers = {
  all: [
    'message',
    'pm',
    'mention',
    'group_mention',
    'room_invite',
    'activity',
    'incoming',
    'missed',
  ],
  mentions: ['mention', 'group_mention'],
  messages: ['message', 'pm', 'mention', 'group_mention', 'activity'],
  invites: ['room_invite', 'auto_room_invite'],
  calls: ['incoming', 'missed'],
}

// All available transports.
export const transports = ['desktop', 'push', 'email']
