import 'html5-desktop-notifications'
import config from './constants'
import noop from 'lodash/utility/noop'


// Electron brings own require to window
let electron
let remote
if (window.require) {
  electron = require('electron')
  remote = require('remote')
}

const macGap = window.MacGap

/**
 * Subscribe on Electron main process event.
 */
export function onElectron(event, callback) {
  if (electron) {
    electron.ipcRenderer.on(event, callback)
    return true
  }
  return false
}

export function notificate({title, content, icon, slug}, callback = noop) {
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
    electron.ipcRenderer.send(
      'showNotification',
      {
        title,
        slug,
        message: content
      }
    )
    return
  }

  // This will show native HTML Notification.
  const {notify} = window
  notify.config(config)
  const notification = notify.createNotification(title, {
    body: content,
    icon,
    timeout: 6000,
    onclick: () => {
      callback()
      window.focus()
      notification.close()
    }
  })
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
