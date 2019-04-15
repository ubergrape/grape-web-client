export const dispatchers = {
  all: [
    'message',
    'pm',
    'mention',
    'group_mention',
    'room_invite',
    'activity',
    'incoming_call',
  ],
  mentions: ['mention', 'group_mention'],
  messages: ['message', 'pm', 'mention', 'group_mention', 'activity'],
  incomingCall: 'incoming_call',
  invites: ['room_invite'],
}

// All available transports.
export const transports = ['desktop', 'push', 'email']
