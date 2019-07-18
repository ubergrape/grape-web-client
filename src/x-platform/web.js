/**
 * Create native html notification.
 */
export function createNotification(options, callbacks = {}, params = {}) {
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
    callbacks.onClick(e, notification)
    notification.close()
    window.focus()
  })

  notification.addEventListener('close', e => {
    if (callbacks.onClose) callbacks.onClose(e)
  })

  return notification
}

/**
 * Open an url in browser.
 */
export openUrl from './open-url'
