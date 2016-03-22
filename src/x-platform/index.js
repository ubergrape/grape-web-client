import * as web from './web'
import * as electron from './electron'
import * as macGap from './macGap'

let implementation = web

if (window.MacGap) implementation = macGap
else if (window.require && window.process) implementation = electron

export function createNotification(...args) {
  return implementation.createNotification(...args)
}

export function openUrl(...args) {
  return implementation.openUrl(...args)
}

export function addBadge(...args) {
  return implementation.addBadge(...args)
}

export function removeBadge(...args) {
  return implementation.removeBadge(...args)
}
