import 'html5-desktop-notifications'
import config from './constants'
import noop from 'lodash/utility/noop'

let electron
let remote
if (window.require) {
  electron = require('electron')
  remote = require('remote')
}

const macGap = window.MacGap

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
 * Open a url in browser and MacGap.
 */
export function openUrl(url) {
  if (electron) return electron.shell.openExternal(url)
  if (macGap) return macGap.openURL(url)
  window.open(url)
}

/**
 * Renders the doc icon badge.
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
 * Removes the doc icon badge.
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
