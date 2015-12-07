/**
 * Escape markdown link target.
 */
export function encodeMDLink(link) {
  const regExp = /[()]/g
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
