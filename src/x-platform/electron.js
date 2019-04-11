import noop from 'lodash/noop'
import random from 'lodash/random'

import { openUrl, createNotification as createWebNotification } from './web'

export function createNotification(options, callback = noop) {
  window.GrapeAppBridge.showNotification(options, callback, {
    random,
    createWebNotification,
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
  window.GrapeAppBridge.addBadge(text)
}

/**
 * Remove badge will:
 * - remove the doc icon badge
 * - remove OSX Tray highlighting
 * - remove Windows Taskbar Icon highlighting
 */
export function removeBadge() {
  window.GrapeAppBridge.removeBadge()
}

// window.GrapeAppBridge comes from preload script in desktop app
export const isElectron = window.GrapeAppBridge
