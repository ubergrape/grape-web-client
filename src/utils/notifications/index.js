export function shouldNotify({time, sourceChannelId, currentChannelId}) {
  const hasExpired = (new Date() - time) / 1000 > 60

  // Message is too old - to prevent old msgs avalanche when server reloads
  // or device resumes from standby.
  if (hasExpired) return false

  // Chat is focused on the channel the notification comes from.
  if (sourceChannelId === currentChannelId && document.hasFocus()) return false

  return true
}

/**
 * Only show notification alert in supported browsers and if user hasn't
 * accepted or declined notifications yet.
 * IE supports notifications in "SiteMode" only and in this mode permission is
 * granted automatically.
 */
export function shouldRequestPermission() {
  if (!window.Notification) return false
  return (
    Notification.permission === 'default' &&
    (!window.external || !window.external.msIsSiteMode())
  )
}
