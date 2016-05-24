import parseUrl from '../parse-url'
import {grapeProtocol} from './constants'

/**
 * Escape markdown link target or name.
 */
export function encodeMdLink(link) {
  const regExp = /[\[\]()]/g
  return link.replace(regExp, c => '%' + c.charCodeAt(0).toString(16))
}

/**
 * Get trigger string based on object type
 */
export function getTrigger(type) {
  switch (type) {
    case 'user':
    case 'room':
      return '@'
    default:
      return '#'
  }
}

/**
 * Returns true if passed url uses grapes own protocol.
 */
export function isGrapeUrl(url) {
  return parseUrl(url).protocol === grapeProtocol
}

/**
 * Create an options object from text and grape url which will be accepted by
 * the classes.
 */
export function getOptions(text, grapeUrl) {
  if (!isGrapeUrl(grapeUrl)) return false
  const [service, type, id, url] = grapeUrl.slice(5).split('|')
  return {
    id,
    service,
    type,
    url,
    name: text,
    slug: url.replace('/chat/', ''),
    nameWithoutTrigger: text[0] === getTrigger(type) ? text.substr(1) : text
  }
}
