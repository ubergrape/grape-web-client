export const maxChannelNameLength = 50
export const maxChannelDescriptionLength = 100

// https://staging.chatgrape.com/doc/rpc.html
// status (int) - presence status within the organization:
// 0 Offline, 4 Reachable, 16 Online
export const userStatusMap = {
  0: 'offline',
  4: 'reachable',
  8: 'inCall',
  16: 'online',
}

export const maxLinkAttachments = 5

export const messageDeliveryStates = ['pending', 'sent', 'unsent', 'read']
