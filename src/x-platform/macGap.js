const macGap = window.MacGap

export function createNotification({title, content}) {
  macGap.notify({
    title,
    content,
    sound: false
  })
}

/**
 * Open an url.
 */
export function openUrl(url) {
  return macGap.openURL(url)
}

/**
 * Renders the doc icon badge.
 */
export function addBadge(text) {
  macGap.Dock.addBadge(text)
}

/**
 * Removes the doc icon badge.
 */
export function removeBadge() {
  macGap.Dock.removeBadge()
}
