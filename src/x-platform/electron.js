import noop from 'lodash/noop'
import get from 'lodash/get'
import random from 'lodash/random'

import { openUrl, createNotification as createWebNotification } from './web'

// Electron implements require on window.
let electron

// This is a hack to avoid webpack trying to find this dependency.
// We could add `externals` to webpack config, but this will be needed to be done
// in every package that uses this one.
if (window.require && (window && window.process && window.process.type)) {
  electron = window.require('electron')
}

const notificationClickTimeout = 20000

export function createNotification(options, callback = noop) {
  // Those checks should be removed within some time. Only window.grapeAppBridge usage should be saved
  if (window.GrapeAppBridge) {
    window.GrapeAppBridge.showNotification(options, callback, {
      random,
      createWebNotification,
    })
    return
  }

  if (window.grapeAppBridge) {
    window.grapeAppBridge.showNotification(options, callback, {
      random,
      createWebNotification,
    })
    return
  }

  if (electron.remote.getGlobal('isNotificationSupported')) {
    createWebNotification(options, callback)
    return
  }

  const event = random(10000)
  const { title, content } = options

  electron.ipcRenderer.once(event, callback)

  electron.ipcRenderer.send('showNotification', {
    event,
    title,
    message: content,
  })

  setTimeout(() => {
    electron.ipcRenderer.removeAllListeners(event)
  }, notificationClickTimeout)
}

/**
 * Electron implements the web api.
 */
export { openUrl }

/**
 * Add badge will:
 * - render the doc icon badge
 * - highlight OSX Tray
 * - highlight Windows Taskbar Icon
 */
export function addBadge(text) {
  // Those checks should be removed within some time. Only window.grapeAppBridge usage should be saved
  if (window.grapeAppBridge) {
    window.grapeAppBridge.addBadge(text)
    return
  }

  if (window.GrapeAppBridge) {
    window.GrapeAppBridge.addBadge(text)
    return
  }

  electron.ipcRenderer.send('addBadge', text)
}

/**
 * Remove badge will:
 * - remove the doc icon badge
 * - remove OSX Tray highlighting
 * - remove Windows Taskbar Icon highlighting
 */
export function removeBadge() {
  // Those checks should be removed within some time. Only window.grapeAppBridge usage should be saved
  if (window.grapeAppBridge) {
    window.grapeAppBridge.removeBadge()
    return
  }

  if (window.GrapeAppBridge) {
    window.GrapeAppBridge.removeBadge()
    return
  }

  electron.ipcRenderer.send('removeBadge')
}

// window.GrapeAppBridge comes from preload script in desktop app
export const isElectron =
  window.grapeAppBridge ||
  window.GrapeAppBridge ||
  get(window, 'process.versions.electron')
