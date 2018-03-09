import noop from 'lodash/utility/noop'
import random from 'lodash/number/random'
import emoji from 'grape-js-emoji'
import get from 'lodash/object/get'

import {openUrl, createNotification as createWebNotification} from './web'

// Electron implements require on window.
let electron
let remote

// This is a hack to avoid webpack trying to find this dependency.
// We could add `externals` to webpack config, but this will be needed to be done
// in every package that uses this one.
if (window.require) {
  electron = window.require('electron')
  remote = electron.remote
}

const notificationClickTimeout = 20000

// http://crocodillon.com/blog/parsing-emoji-unicode-in-javascript
const emojiRegExp = new RegExp([
  '\\ud83c[\\udf00-\\udfff]', // U+1F300 to U+1F3FF
  '\\ud83d[\\udc00-\\ude4f]', // U+1F400 to U+1F64F
  '\\ud83d[\\ude80-\\udeff]'  // U+1F680 to U+1F6FF
].join('|'), 'g')

/**
 * Replaces emoji symbol with it's text representation.
 * '👍' => ':+1:'
 */
function replaceEmojisWithText(content) {
  return content.replace(
    emojiRegExp,
    match => `:${emoji.data[match.codePointAt().toString(16)][3][0]}:`
  )
}

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
      message: replaceEmojisWithText(content)
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

export const isElectron = get(window, 'process.versions.electron')
