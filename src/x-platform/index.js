import * as web from './web'
import * as electron from './electron'
import * as macGap from './macGap'

let implementation = web

if (window.MacGap) implementation = macGap
else if (window.require && window.process) implementation = electron

export function createNotification(...args) {
  if (implementation.createNotification) {
    return implementation.createNotification(...args)
  }
}

export function openUrl(...args) {
  if (implementation.openUrl) return implementation.openUrl(...args)
}

export function addBadge(...args) {
  if (implementation.addBadge) return implementation.addBadge(...args)
}

export function removeBadge(...args) {
  if (implementation.removeBadge) return implementation.removeBadge(...args)
}
