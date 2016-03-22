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
export const {addBadge} = macGap.Dock

/**
 * Removes the doc icon badge.
 */
export const {removeBadge} = macGap.Dock
