export function createNotification({title, content, icon}) {
  MacGap.notify({
    title,
    content,
    sound: false
  })
}

/**
 * Open an url.
 */
export function openUrl(url) {
  return MacGap.openURL(url)
}

/**
 * Renders the doc icon badge.
 */
export function addBadge(text) {
  MacGap.Dock.addBadge(text)
}

/**
 * Removes the doc icon badge.
 */
export function removeBadge() {
  MacGap.Dock.removeBadge()
}
