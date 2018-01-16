import noop from 'lodash/utility/noop'

/**
 * Create native html notification.
 */
export function createNotification({title, content, icon}, callback = noop) {
  if (!window.Notification) return
  const n = new Notification(title, {
    icon,
    body: content,
    silent: true,
    onclick: () => {
      window.focus()
      n.close()
      callback()
    }
  })
}

/**
 * Open an url in browser.
 */
export function openUrl(url, blank = true) {
  if (blank) {
    window.open(url)
    return
  }
  window.location.href = url
}
