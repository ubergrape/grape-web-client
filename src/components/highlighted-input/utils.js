import escapeRegExp from 'lodash/string/escapeRegExp'

// white space or new line
const emptySpaceRegExp = /^\s$/

const maxObjectsAmount = 1000

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

/*
 * Returns empty object
 * if `objects` keys amount is very large
 */
export function clearIfLarge(objects) {
  // TODO: move to lru like https://github.com/avoidwork/tiny-lru
  const needToClear = Object.keys(objects).length > maxObjectsAmount
  return needToClear ? {} : {...objects}
}

/*
 * Add space before or after string if there is no space or new line.
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
 * Get associated object of tokens (grape objects)
 * and theirs positions. i.e. {token: [[0, 5], [10, 15]]}
 */
function getTokensPositions(tokens, text) {
  const positions = {}

  tokens.forEach(token => {
    positions[token] = getPositions(token, text)
  })

  return positions
}

/**
 * Get an array of substrings and tokens (grape objects) in
 * order of appearance.
 */
export function splitByTokens(text, tokens) {
  let parts
  if (tokens.length) {
    const tokensRegExp = new RegExp(tokens.map(escapeRegExp).join('|'), 'g')
    const keysInText = text.match(tokensRegExp)
    parts = []
    text
      .split(tokensRegExp)
      .forEach((substr, i, arr) => {
        if (substr) parts.push(substr)
        if (i < arr.length - 1) parts.push(keysInText[i])
      })
  } else {
    parts = [text]
  }

  return parts
}

/**
 * Traverse string and get token if
 * caret is inside or right after/before, otherwise return undefined.
 * Token here is 'grape object' or 'possible grape object'
 * i.e. '@Developmend' or '@develo'
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

      if ((nextSymbol && emptySpaceRegExp.test(nextSymbol)) ||
          nextSymbolIndex < 0 ||
          nextSymbolIndex >= text.length) {
        position.push(previousSymbolIndex)
        tailFound = true
        break
      }

      if (position.length) {
        value = value + text[nextSymbolIndex]
      } else {
        value = text[nextSymbolIndex] + value
      }

      previousSymbolIndex = nextSymbolIndex
      nextSymbolIndex = position.length ? nextSymbolIndex + 1 : nextSymbolIndex - 1
    }
  }

  return value ? {value, position} : null
}

export function getTokenPositionNearCaret(node, direction, tokens) {
  const {selectionStart, selectionEnd, value} = node
  const positions = getTokensPositions(tokens, value)

  let nearPosition

  Object.keys(positions).some(object => {
    positions[object].some(position => {
      // Check if carret inside object
      if (
        position[0] <= selectionStart &&
        position[1] >= selectionEnd
      ) {
        // If selectionStart or selectionEnd
        // not inside object —> do nothing
        if (
          direction === 'next' && position[1] === selectionEnd ||
          direction === 'prev' && position[0] === selectionStart
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

export function setCaretPosition(at, node) {
  function set() {
    node.selectionStart = at
    node.selectionEnd = at
  }
  if (isFocused(node)) set()
  else focus(node, set)
}
