export function shouldNotify({ time, sourceChannelId, currentChannelId }) {
  const hasExpired = (new Date() - time) / 1000 > 60

  // Message is too old - to prevent old msgs avalanche when server reloads
  // or device resumes from standby.
  if (hasExpired) return false

  // Chat is focused on the channel the notification comes from.
  if (sourceChannelId === currentChannelId && document.hasFocus()) return false

  return true
}

export const shouldRequestPermission = () =>
  window.Notification && Notification.permission === 'default'
