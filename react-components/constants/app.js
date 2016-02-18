import staticurl from 'staticurl'

export const maxChannelNameLength = 50

// https://staging.chatgrape.com/doc/rpc.html
// status (int) - presence status within the organization:
// 0 Offline, 16 Online
export const userStatus = {
  0: 'offline',
  16: 'online'
}

export const defaultAvatar = staticurl('images/avatar.gif')
export const invitedAvatar = staticurl('images/avatar_invited.gif')
