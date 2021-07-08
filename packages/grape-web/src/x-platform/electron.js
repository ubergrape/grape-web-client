import random from 'lodash/random'
import {
  openUrl,
  updateNotification,
  createNotification as createWebNotification,
} from './web'

export const createNotification = options => {
  const { properties, params, callbacks } = options

  // Changing API for showNotification function, but old desktop clients should also be supported.
  // Please remove within some time. window.grapeAppVersion only exist for desktop client >= 3.0.0
  if (!window.grapeAppVersion) {
    // Handling notifications for old desktop client (< 3.0.0)
    window.grapeAppBridge.showNotification(
      properties,
      callbacks,
      {
        random,
        createWebNotification,
      },
      params,
    )
    return
  }

  // Handling notifications for new desktop client (>= 3.0.0)
  window.grapeAppBridge.showNotification({
    properties,
    params,
    callbacks,
    dependencies: {
      random,
      createWebNotification,
    },
  })

  window.grapeAppBridge.bounceIcon()
}

/**
 * Electron implements the web api.
 */
export { openUrl }

/**
 * Electron implements updating existing notification
 */
export { updateNotification }

/**
 * Add badge will:
 * - render the doc icon badge
 * - highlight OSX Tray
 * - highlight Windows Taskbar Icon
 */
export const addBadge = text => {
  window.grapeAppBridge.addBadge(text)
}

/**
 * Remove badge will:
 * - remove the doc icon badge
 * - remove OSX Tray highlighting
 * - remove Windows Taskbar Icon highlighting
 */
export const removeBadge = () => {
  window.grapeAppBridge.removeBadge()
}

// Sends signal to Electron that call started
export const onCallStarted = () => {
  // Backward compatibility, remove within sometime
  if (window.grapeAppBridge.onCallStarted) {
    window.grapeAppBridge.onCallStarted()
  }
}

// Sends signal to Electron that call finished
export const onCallFinished = () => {
  // Backward compatibility, remove within sometime
  if (window.grapeAppBridge.onCallFinished) {
    window.grapeAppBridge.onCallFinished()
  }
}

export const setWebClientVersion = version => {
  // Backward compatibility, remove within sometime
  if (window.grapeAppBridge.setWebClientVersion) {
    window.grapeAppBridge.setWebClientVersion(version)
  }
}

// window.grapeAppBridge comes from preload script in desktop app
export const isElectron = window.grapeAppBridge
