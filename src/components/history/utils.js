// Group messages under same avatar/name if they are send within this time distance.
const timeThreshold = 5 * 60 * 1000

export function canGroup(message, prevMessage) {
  if (!prevMessage || !message) return false

  // We don't group activities?
  if (message.type === 'activity') return false

  // Is not the same author.
  if (prevMessage.author.id !== message.author.id) return false

  // Group if within defined time threshold.
  return prevMessage.time.getTime() + timeThreshold > message.time.getTime()
}
