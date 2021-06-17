/**
 * Create native html notification.
 */

export const createNotification = (...args) => {
  if (!window.Notification) return null

  let properties
  let callbacks
  let params

  // Handling of changing API for createNotification function, but old desktop clients should also be supported.
  // Please remove within some time.
  if (args[1]) {
    // Handling notifications for old desktop client (grape-electron < 3.0.0)
    ;[properties, callbacks, params] = args
  } else {
    // Handling notifications for new desktop client (grape-electron >= 3.0.0)
    // eslint-disable-next-line prefer-destructuring
    ;({ properties, params, callbacks } = args[0])
  }

  const notification = new Notification(properties.title, {
    body: properties.content,
    silent: true,
    ...properties,
  })

  if (properties.requireInteraction) {
    setTimeout(() => {
      notification.close()
    }, params.timeout || 3000)
  }

  if (callbacks.onClick) {
    notification.onclick = e => {
      callbacks.onClick(e, notification)
      notification.close()
      window.focus()
      if (window.grapeAppBridge && window.grapeAppBridge.showMainWindow)
        window.grapeAppBridge.showMainWindow()
    }
  }

  if (callbacks.onClose) {
    notification.onclose = e => {
      callbacks.onClose(e, notification)
    }
  }

  return notification
}

/**
 * Open an url in browser.
 */
export openUrl from './open-url'
