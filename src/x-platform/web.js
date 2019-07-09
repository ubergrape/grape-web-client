import noop from 'lodash/noop'

/**
 * Create native html notification.
 */
export function createNotification(options, callback = noop, params = {}) {
  if (!window.Notification) return null
  const notification = new Notification(options.title, {
    body: options.content,
    silent: true,
    ...options,
  })

  if (options.requireInteraction) {
    setTimeout(() => {
      notification.close()
    }, params.timeout || 3000)
  }

  notification.addEventListener('click', e => {
    if (options.onClick) {
      options.onClick(e, notification)
      return
    }

    notification.close()
    callback()
    window.focus()
  })

  notification.addEventListener('close', e => {
    if (options.onClose) {
      options.onClose(e)
    }
  })
  return notification
}

/**
 * Open an url in browser.
 */
export openUrl from './open-url'
