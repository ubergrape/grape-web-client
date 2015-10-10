let regExp = /[()]/g

/**
 * Escape markdown link target.
 */
export default function escapeMDLink(link) {
  return link.replace(regExp, function(c) {
    return '%' + c.charCodeAt(0).toString(16)
  })
}
