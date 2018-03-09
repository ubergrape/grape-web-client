import * as web from './web'
import * as electron from './electron'

let implementation = web
if (electron.isElectron) {
  implementation = electron
}

export function createNotification(...args) {
  if (implementation.createNotification) {
    return implementation.createNotification(...args)
  }
  return null
}

export function openUrl(...args) {
  if (implementation.openUrl) return implementation.openUrl(...args)
  return null
}

export function addBadge(...args) {
  if (implementation.addBadge) return implementation.addBadge(...args)
  return null
}

export function removeBadge(...args) {
  if (implementation.removeBadge) return implementation.removeBadge(...args)
  return null
}

export getMode from './mode'
