let electron
if (require) electron = require('electron')

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
  if (window.MacGap) {
    window.MacGap.Dock.addBadge(text)
    return
  }
  if (electron) {
    electron.ipcRenderer.send('addBadge', text)
    return
  }
}

/**
 * Removes the doc icon badge.
 */
export function removeBadge() {
  if (window.MacGap) {
    window.MacGap.Dock.removeBadge()
  }
  if (electron) {
    electron.ipcRenderer.send('removeBadge')
  }
}
