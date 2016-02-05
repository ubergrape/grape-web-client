import {getTrigger} from '../objects/utils'
import parseQuery from '../query/parse'
import {escapeRegExp} from 'lodash/string'
import {QUERY_REGEX, EMOJI_REGEX} from '../query/constants'
import {get as getEmoji} from '../emoji'
import {create as createObject} from '../objects'
import {grapeProtocolRegExp} from '../objects/constants'

// This regex is taken from "marked" module almost "as it is".
// At the beginning "^!?" has been removed to match all objects.
// We don't use full md parser because its harder to setup it to ignore
// everything except of links.
const linkRegExp = /\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/g

// white space or new line
const emptySpaceRegExp = /^\s$/

const maxObjectsAmount = 1000

function tokenWithoutTrigger(token, type) {
  return token[0] === getTrigger(type) ? token.substr(1) : token
}

/**
 * Get data map from md object.
 */
function toData(text, url) {
  if (!grapeProtocolRegExp.test(url)) return false
  const parts = url.slice(5).split('|')
  return {
    id: tokenWithoutTrigger(parts[2], parts[1]),
    name: tokenWithoutTrigger(text, parts[1]),
    slug: parts[3].replace('/chat/', ''),
    service: parts[0],
    type: parts[1],
    url: parts[3]
  }
}

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

function getEmojiData(token) {
  return {
    type: 'emoji',
    shortname: token,
    content: token
  }
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
 * Parse emoji smiles, like ':smile:'
 */
export function parseEmoji(content) {
  let data = []
  const emoji = content.match(EMOJI_REGEX)
  if (emoji) data = emoji.map(item => getEmojiData(item.trim()))
  return data
}

/**
 * Returns new `objects` if there is new emoji in value
 */
export function getEmojiObjects(value) {
  const emojis = parseEmoji(value).filter(({shortname}) => {
    return getEmoji(shortname)
  })

  if (!emojis.length) return {}

  const objects = emojis.reduce((_objects, emoji) => {
    _objects[emoji.shortname] = createObject('emoji', emoji)
    return _objects
  }, {})

  return objects
}

/**
 * Get associated object of tokens (grape objects)
 * and theirs positions. i.e. {token: [[0, 5], [10, 15]]}
 */
export function getTokensPositions(objects, text) {
  const positions = {}

  Object.keys(objects).forEach(key => {
    positions[key] = getPositions(key, text)
  })

  return positions
}

/**
 * Get an array of substrings and tokens (grape objects) in
 * order of appearance.
 */
export function tokenize(text, tokens) {
  let allTokens
  if (tokens.length) {
    const tokensRegExp = new RegExp(tokens.map(escapeRegExp).join('|'), 'g')
    const keysInText = text.match(tokensRegExp)
    allTokens = []
    text
      .split(tokensRegExp)
      .forEach((substr, i, arr) => {
        if (substr) allTokens.push(substr)

        // TODO ??
        if (i < arr.length - 1) allTokens.push(keysInText[i])
      })
  } else {
    allTokens = [text]
  }

  return allTokens
}

/**
 * Traverse string and get token if
 * caret is inside or right after/before, otherwise return false.
 * Token here is 'grape object' or 'possible grape object'
 * i.e. '@Developmend' or '@develo'
 */
export function getTokenUnderCaret(string, caretPostion) {
  if (!string) return false

  const token = {
    text: '',
    position: []
  }
  const {position} = token

  while (position.length < 2) {
    let nextSymbolIndex = position.length ? caretPostion : caretPostion - 1
    let previousSymbolIndex = nextSymbolIndex
    let tailFound = false

    while (!tailFound) {
      const nextSymbol = string[nextSymbolIndex]

      if ((nextSymbol && emptySpaceRegExp.test(nextSymbol)) ||
          nextSymbolIndex < 0 ||
          nextSymbolIndex >= string.length) {
        position.push(previousSymbolIndex)
        tailFound = true
        break
      }

      if (position.length) {
        token.text = token.text + string[nextSymbolIndex]
      } else {
        token.text = string[nextSymbolIndex] + token.text
      }

      previousSymbolIndex = nextSymbolIndex
      nextSymbolIndex = position.length ? nextSymbolIndex + 1 : nextSymbolIndex - 1
    }
  }

  return Boolean(token.text) && token
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
 * Return query if value is query or false
 */
export function getQuery(value, caretAt) {
  const token = getTokenUnderCaret(value, caretAt)
  const isQuery = Boolean(token.text && token.text.match(QUERY_REGEX))
  if (isQuery) return parseQuery(token.text)
}

/**
 * Check if an element is focused.
 */
export function isFocused(node) {
  return node === document.activeElement
}

const isTrident = /Trident/.test(window.navigator.userAgent)

/**
 * Focus element with IE hack.
 */
export function focus(node, callback) {
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

export function toMarkdown(text, objects) {
  const tokens = tokenize(text, Object.keys(objects))
  return tokens.map(token => {
    return objects[token] ? objects[token].str : token
  }).join('')
}

/**
 * Parse all md links and convert them to array of data.
 */
 // TODO
export function fromMarkdown(md) {
  const objects = {}

  let value = md.replace(linkRegExp, (match, token, url) => {
    const data = toData(token, url)
    if (!data) return match
    const object = createObject(data.type, data)
    objects[object.content] = object

    return object.content
  })

  value = value.replace(EMOJI_REGEX, match => {
    const data = getEmojiData(match.trim())
    objects[data.content] = createObject(data.type, data)
    return match
  })

  return {objects, value}
}
