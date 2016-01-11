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

function tokenWithTrigger(token, type) {
  const trigger = getTrigger(type)
  return token[0] === trigger ? token : trigger + token
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

function getEmojiConfig(token) {
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
 * Add space before or after string,
 * if there is no space or new line.
 */
export function ensureSpace(where, str) {
  let result = str || ' '

  switch (where) {
    case 'before':
      if (!emptySpaceRegExp.test(result[0])) result = ` ${result}`
      break
    case 'after':
      if (!emptySpaceRegExp.test(result.slice(-1))) result = `${result} `
      break
    default:
  }

  return result
}

/**
 * Parse all md links and convert them to array of data.
 */
export function parseAndReplace(content) {
  const configs = []
  let text = content.replace(linkRegExp, (match, token, url) => {
    const config = toData(token, url)
    if (!config) return match

    configs.push(config)
    return tokenWithTrigger(token, config.type)
  })

  text = text.replace(EMOJI_REGEX, (match) => {
    configs.push(getEmojiConfig(match.trim()))
    return match
  })

  return {configs, text}
}

/**
 * Parse emoji smiles, like ':smile:'
 */
export function parseEmoji(content) {
  let data = []
  const emoji = content.match(EMOJI_REGEX)
  if (emoji) data = emoji.map(item => getEmojiConfig(item.trim()))
  return data
}

/**
 * Returns new `objects` if there is new emoji in value
 */
export function updateIfNewEmoji(objects, value) {
  let emoji = parseEmoji(value).filter(({shortname}) => {
    return getEmoji(shortname) && !objects[shortname]
  })

  if (emoji.length) {
    emoji = emoji.reduce((prev, config) => {
      prev[config.shortname] = createObject('emoji', config)
      return prev
    }, {})

    return {...objects, ...emoji}
  }

  return objects
}

/**
 * Get associated object of tokens (grape objects)
 * and theirs positions. i.e. {token: [[0, 5], [10, 15]]}
 */
export function getObjectsPositions(objects, text) {
  const objectsPositions = {}

  Object.keys(objects).forEach(key => {
    objectsPositions[key] = getPositions(key, text)
  })

  return objectsPositions
}

/**
 * Get an array of substrings and tokens (grape objects) in
 * order of appearance.
 */
export function getTextAndObjects(objects, text) {
  let content
  const tokens = Object.keys(objects)

  if (tokens.length) {
    const tokensRegExp = new RegExp(tokens.map(escapeRegExp).join('|'), 'g')
    const keysInText = text.match(tokensRegExp)
    content = []
    text
      .split(tokensRegExp)
      .forEach((substr, i, arr) => {
        content.push(substr)
        if (i < arr.length - 1) content.push(objects[keysInText[i]])
      })
  } else {
    content = [text]
  }

  return content
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

/**
 * Return query if value is query or false
 */
export function getQuery(value, selectionEnd) {
  const token = getTokenUnderCaret(value, selectionEnd)
  const isQuery = Boolean(token.text && token.text.match(QUERY_REGEX))

  return isQuery ? parseQuery(token.text) : false
}

/**
 * Check if an element is focused.
 */
export function isFocused(node) {
  return node === document.activeElement
}
