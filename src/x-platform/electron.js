import noop from 'lodash/utility/noop'
import random from 'lodash/number/random'

import {openUrl, createNotification as createWebNotification} from './web'

// Electron implements require on window.
let electron
let remote

// This is a hack to avoid webpack trying to find this dependency.
// We could add `externals` to webpack config, but this will be needed to be done
// in every package that uses this one.
if (window.require) {
  electron = window.require('electron')
  remote = window.require('remote')
}

const notificationClickTimeout = 20000

export function createNotification(options, callback = noop) {
  // This will show native HTML Notification.
  if (remote.getGlobal('isNotificationSupported')) {
    createWebNotification(options, callback)
    return
  }

  const event = random(10000)
  const {title, content} = options

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

/**
 * Shows text input related context menu.
 */
function initContextMenu() {
  const menu = remote.Menu.buildFromTemplate([
    {
      label: 'Cut',
      click: () => {
        document.execCommand('cut')
      }
    },
    {
      label: 'Copy',
      click: () => {
        document.execCommand('copy')
      }
    },
    {
      label: 'Paste',
      click: () => {
        document.execCommand('paste')
      }
    }
  ])

  document.addEventListener('contextmenu', e => {
    switch (e.target.nodeName) {
      case 'TEXTAREA':
      case 'INPUT':
        e.preventDefault()
        menu.popup(remote.getCurrentWindow())
        break
      default:
    }
  })
}

export function init() {
  initContextMenu()
}
