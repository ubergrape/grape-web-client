const regExp = /[()]/g

/**
 * Escape markdown link target.
 */
export default function encodeMDLink(link) {
  return link.replace(regExp, c => '%' + c.charCodeAt(0).toString(16))
}
