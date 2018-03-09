import noop from 'lodash/utility/noop'

/**
 * Create native html notification.
 */
export function createNotification({title, content, icon}, callback = noop) {
  if (!window.Notification) return
  const notification = new Notification(title, {
    icon,
    body: content,
    silent: true
  })
  notification.addEventListener('click', () => {
    callback()
    window.focus()
    notification.close()
  })
}

/**
 * Open an url in browser.
 */
export openUrl from './open-url'
