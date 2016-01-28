/**
 * Open a url in browser and MacGap.
 */
export function openUrl(url) {
  if (window.MacGap) {
    return window.MacGap.openURL(url)
  }

  window.open(url)
}

/**
 * Renders the doc icon badge.
 */
export function addBadge(text) {
  if (!window.MacGap) return
  window.MacGap.Dock.addBadge(text)
}

/**
 * Removes the doc icon badge.
 */
export function removeBadge() {
  if (!window.MacGap) return
  window.MacGap.Dock.removeBadge()
}
