import {
  notificationsConfig,
  notificationClickTimeout
} from './constants'
import noop from 'lodash/utility/noop'
import random from 'lodash/number/random'


// Electron brings own require to window
let electron
let remote
if (window.require) {
  electron = require('electron')
  remote = require('remote')
}

const macGap = window.MacGap

export function createNotification({title, content, icon}, callback = noop) {
  if (macGap) {
    macGap.notify({
      title,
      content,
      sound: false
    })
    return
  }

  // This will show Windows Tray Balllon in Windows < 10.
  if (electron && !remote.getGlobal('isNotificationSupported')) {
    const id = random(10000)

    electron.ipcRenderer.once(id, () => callback())

    electron.ipcRenderer.send(
      'showNotification',
      {
        id,
        title,
        message: content
      }
    )
    setTimeout(() => {
      electron.ipcRenderer.removeAllListeners(id)
    }, notificationClickTimeout)
    return
  }

  // This will show native HTML Notification.
  const {notify} = window
  if (notify) {
    notify.config(notificationsConfig)
    const notification = notify.createNotification(title, {
      icon,
      tag: title,
      body: content,
      onclick: () => {
        callback()
        window.focus()
        notification.close()
      }
    })
  }
}

/**
 * Open a url in browser, MacGap or Electron.
 * Electron handle url open on main process side.
 */
export function openUrl(url, _blank = true) {
  if (macGap) return macGap.openURL(url)
  if (_blank) return window.open(url)
  window.location.href = url
}

/**
 * Renders
 * - the doc icon badge (MacGap, Electron)
 * - highlight OSX Tray (Electron)
 * - highlight Windows Taskbar Icon (Electron)
 */
export function addBadge(text) {
  if (macGap) {
    macGap.Dock.addBadge(text)
    return
  }
  if (electron) {
    electron.ipcRenderer.send('addBadge', text)
    return
  }
}

/**
 * Removes
 * - the doc icon badge (MacGap, Electron)
 * - highlight OSX Tray (Electron)
 * - highlight Windows Taskbar Icon (Electron)
 */
export function removeBadge() {
  if (macGap) {
    macGap.Dock.removeBadge()
    return
  }
  if (electron) {
    electron.ipcRenderer.send('removeBadge')
    return
  }
}
