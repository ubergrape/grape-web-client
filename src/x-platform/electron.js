import noop from 'lodash/utility/noop'
import random from 'lodash/number/random'

import {openUrl, createNotification as createWebNotification} from './web'

// Electron implements require on window.
const electron = require('electron')
const remote = require('remote')

const isNotificationSupported = remote.getGlobal('isNotificationSupported')
const notificationClickTimeout = 20000

export function createNotification(options, callback = noop) {
  // This will show native HTML Notification.
  if (isNotificationSupported) {
    createWebNotification(options, callback)
    return
  }

  const event = random(10000)
  const {title, content, icon} = options

  electron.ipcRenderer.once(event, callback)

  // This will show Windows Tray Balllon in Windows < 10.
  electron.ipcRenderer.send(
    'showNotification',
    {
      event,
      title,
      message: content
    }
  )
  setTimeout(() => {
    electron.ipcRenderer.removeAllListeners(event)
  }, notificationClickTimeout)
}

/**
 * Electron implements the web api.
 */
export {openUrl}

/**
 * Add badge will:
 * - render the doc icon badge
 * - highlight OSX Tray
 * - highlight Windows Taskbar Icon
 */
export function addBadge(text) {
  electron.ipcRenderer.send('addBadge', text)
}

/**
 * Remove badge will:
 * - remove the doc icon badge
 * - remove OSX Tray highlighting
 * - remove Windows Taskbar Icon highlighting
 */
export function removeBadge() {
  electron.ipcRenderer.send('removeBadge')
}
