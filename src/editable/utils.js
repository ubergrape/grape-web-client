import toArray from 'lodash/lang/toArray'
import query from 'component-query'
import escape from 'lodash/string/escape'
import escapeRegExp from 'lodash/string/escapeRegExp'

/**
 * Replace last occurrence of grape query within `content` by `replacement`.
 */
export function replaceLastQuery(replacement, queryStr, content) {
  let r = new RegExp(escapeRegExp(queryStr) + '$')
  return content.replace(r, replacement)
}

/**
 * Ensure we have only one type of white spaces.
 */
export function htmlWhitespacesToText(text) {
  return text.replace(/\s|&nbsp;/g, ' ')
}

/**
 * Replace newlines by paragraphs, for further usage within contenteditable.
 */
export function splitTextInParagraphs(text) {
  let parts = text.split(/\n/)
  parts = parts.map(part => `<p>${part}</p>`)
  let html = parts.join('')
  return html
}

/**
 * Convert text to html prepared for contenteditable.
 * - escape html entities
 * - convert whitespaces to html entities
 * - convert new lines to paragraphs
 */
export function textToHtml(text) {
  // In case we have html in text.
  let html = escape(text)
  html = html.replace(/ /g, '&nbsp;')
  html = splitTextInParagraphs(html)
  return html
}

/**
 * Returns true if content has no text and no grape objects.
 */
export function isEmpty(node) {
  if (!node) return true
  if (node.childNodes.length > 1) return false
  if (!node.textContent.trim().length && !findGrapeObjects(node).length) return true
  return false
}

/**
 * Recursively remove node and every parent if it is empty until a passed untilNode.
 */
export function removeEmpty(node, untilNode) {
  if (node !== untilNode && isEmpty(node)) {
    let parent = node.parentNode
    if (parent && !removeEmpty(parent, untilNode)) {
      parent.removeChild(node)
      return true
    }
  }
  return false
}

/**
 * True when contains data-object md string.
 */
export function isGrapeObject(el) {
  return Boolean(el && el.dataset.object)
}

/**
 * Find elements which are grape objects and contain md data.
 */
export function findGrapeObjects(parent) {
  return toArray(query.all('[data-object]', parent))
}

/**
 * Parse data-result json from passed elements.
 */
export function getResultsFromGrapeObjects(node) {
  let elements = findGrapeObjects(node)
  let results = elements.map((el) => {
    let {result} = el.dataset
    return result ? JSON.parse(result) : {}
  })
  return results
}

/**
 * Serialize child nodes and get text content.
 * - Convert html to text.
 * - Convert grape elements to markdown.
 */
export function getText(node) {
  // Avoid modifying original nodes.
  let newNode = node.cloneNode(true)

  // Replace all grape object elements by their md representation.
  findGrapeObjects(newNode).forEach((el) => {
    let text = document.createTextNode(el.dataset.object)
    el.parentNode.replaceChild(text, el)
  })

  // Replace br tags by new lines.
  toArray(query.all('br', newNode)).forEach((el) => {
    el.parentNode.replaceChild(document.createTextNode('\n'), el)
  })

  // .textContent will strip all tags, we need to ensure line breaks persist.
  let text = ''
  // Concatenate text contents of paragraphs and separate them by new lines.
  toArray(query.all('p', newNode)).forEach((el, i, elms) => {
    text += el.textContent.trim()
    if (i < elms.length - 1) text += '\n'
  })

  return text
}

/**
 * Check if a node is of type element.
 */
export function isElement(node) {
  return node && node.nodeType === document.ELEMENT_NODE
}

/**
 * Remove node.
 */
export function remove(node) {
  let {parentNode} = node
  if (parentNode) parentNode.removeChild(node)
}

/**
 * Insert a dom node after/before some ref.
 */
export function insert(side, newNode, refNode) {
  let beforeNode = side === 'after' ? refNode.nextSibling : refNode
  let {parentNode} = refNode
  if (parentNode) parentNode.insertBefore(newNode, beforeNode)
}
