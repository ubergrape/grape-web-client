import escapeRegExp from 'lodash/escapeRegExp'

// white space or new line
const emptySpaceRegExp = /^\s$/

/**
 * Get all indexes for substring:
 * start and end index i.e. [[0, 5], [10, 15]]
 */
function getPositions(sub, str) {
  const subLen = sub.length
  const positions = []

  let startIndex = 0
  let index = str.indexOf(sub, startIndex)
  while (index > -1) {
    startIndex = index + subLen
    positions.push([index, startIndex])
    index = str.indexOf(sub, startIndex)
  }

  return positions
}

/**
 * Add space before or after a string if there is no space or new line.
 */
export function ensureSpace(where, str) {
  let result = str || ' '

  switch (where) {
    case 'before':
      if (result[0] && !emptySpaceRegExp.test(result[0])) result = ` ${result}`
      break
    case 'after':
      if (!emptySpaceRegExp.test(result.slice(-1))) result = `${result} `
      break
    default:
  }

  return result
}

/**
 * Returns a map with token as a key and array of positions
 * i.e. {token: [[0, 5], [10, 15]]}.
 */
function getTokensPositions(tokens, text) {
  const positions = {}

  tokens.forEach(token => {
    positions[token] = getPositions(token, text)
  })

  return positions
}

/**
 * Get an array of strings separated using known tokens.
 * Joining the result of this array should result in the original text.
 */
export function splitByTokens(text, tokens) {
  let parts

  if (tokens.length) {
    const tokensRegExp = new RegExp(tokens.map(escapeRegExp).join('|'), 'g')
    const keysInText = text.match(tokensRegExp)
    parts = []
    text.split(tokensRegExp).forEach((substr, i, arr) => {
      if (substr) parts.push(substr)
      if (i < arr.length - 1) parts.push(keysInText[i])
    })
  } else {
    parts = [text]
  }

  return parts
}

/**
 * Get a word caret is positioned next to or inside of
 * i.e. '|@test' or '@test|' or '@te|st'.
 */
export function getTouchedWord(text, caretPostion) {
  if (!text) return null

  const position = []
  let value = ''

  while (position.length < 2) {
    let nextSymbolIndex = position.length ? caretPostion : caretPostion - 1
    let previousSymbolIndex = nextSymbolIndex
    let tailFound = false

    while (!tailFound) {
      const nextSymbol = text[nextSymbolIndex]

      if (
        (nextSymbol && emptySpaceRegExp.test(nextSymbol)) ||
        nextSymbolIndex < 0 ||
        nextSymbolIndex >= text.length
      ) {
        position.push(previousSymbolIndex)
        tailFound = true
        break
      }

      if (position.length) {
        value += text[nextSymbolIndex]
      } else {
        value = text[nextSymbolIndex] + value
      }

      previousSymbolIndex = nextSymbolIndex
      nextSymbolIndex = position.length
        ? nextSymbolIndex + 1
        : nextSymbolIndex - 1
    }
  }

  return value ? { value, position } : null
}

/**
 * Get position of a token near the caret position by considering the direction
 * to look to and known tokens list.
 */
export function getTokenPositionNearCaret(node, direction, tokens) {
  const { selectionStart, selectionEnd, value } = node
  const positions = getTokensPositions(tokens, value)

  let nearPosition

  Object.keys(positions).some(object => {
    positions[object].some(position => {
      // Check if carret inside object
      if (position[0] <= selectionStart && position[1] >= selectionEnd) {
        // If selectionStart or selectionEnd
        // not inside object —> do nothing
        if (
          (direction === 'next' && position[1] === selectionEnd) ||
          (direction === 'prev' && position[0] === selectionStart)
        ) {
          return false
        }
        nearPosition = position
        return true
      }
    })
    if (nearPosition) return true
  })

  return nearPosition
}

/**
 * Check if an element is focused.
 */
function isFocused(node) {
  return node === document.activeElement
}

const isTrident = /Trident/.test(window.navigator.userAgent)

/**
 * Focus element with IE hack.
 */
function focus(node, callback) {
  if (!node || !node.focus) return
  // Fix for:
  // https://connect.microsoft.com/IE/feedback/details/808820/ie11-input-element-gets-focus-but-caret-not-showing-when-pinch-zooming
  // https://support.microsoft.com/en-us/kb/2927972
  if (isTrident) {
    setTimeout(() => {
      node.focus()
      callback()
    })
    return
  }

  node.focus()
  callback()
}

/**
 * Set the caret position, ensures focus before.
 */
export function setCaretPosition(at, node) {
  function set() {
    node.selectionStart = at
    node.selectionEnd = at
  }
  if (isFocused(node)) set()
  else focus(node, set)
}

/**
 * Scroll editable to the caret position.
 * Scrolling will only happen if caret position is outside of view port.
 */
export function scrollLeftToCaret(node) {
  const { scrollWidth, scrollLeft, offsetWidth, selectionEnd, value } = node
  const left = (scrollWidth * selectionEnd) / value.length
  const isVisible = left > scrollLeft && left < scrollLeft + offsetWidth
  if (!isVisible) node.scrollLeft = left
}

export const getCaretAt = ({ caretPosition, value }) =>
  caretPosition === 'end' ? value.length : 0
