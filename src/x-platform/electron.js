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

export function createNotification(options, callbacks = noop, params = {}) {
  // Those checks should be removed within some time. Only window.grapeAppBridge usage should be saved
  if (window.GrapeAppBridge) {
    window.GrapeAppBridge.showNotification(options, callbacks, params, {
      random,
      createWebNotification,
    })
    return
  }

  if (window.grapeAppBridge) {
    window.grapeAppBridge.showNotification(options, callbacks, params, {
      random,
      createWebNotification,
    })
    return
  }

  const { remote, ipcRenderer } = electron

  if (remote.getGlobal('isNotificationSupported')) {
    createWebNotification(options, callbacks, params)
    return
  }

  const { title, content } = options

  const onClick = random(100000)
  const onClose = random(100000)
  ipcRenderer.once(onClick, callbacks.onClick)
  ipcRenderer.once(onClose, callbacks.onClose)

  setTimeout(() => {
    ipcRenderer.removeAllListeners(onClick)
    ipcRenderer.removeAllListeners(onClose)
  }, notificationClickTimeout)

  // This will show Windows Tray Balllon in Windows < 10.
  ipcRenderer.send('showNotification', {
    events: {
      onClick,
      onClose,
    },
    title,
    message: content,
  })
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
