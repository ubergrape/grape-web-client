/**
 * Open a url in browser and MacGap.
 */
export function openUrl(url) {
  if (window.MacGap) {
    return window.MacGap.openURL(url)
  }

  window.open(url)
}
