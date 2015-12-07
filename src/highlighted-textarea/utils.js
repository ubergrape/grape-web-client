import {getTrigger} from '../objects/utils'
import parseQuery from '../query/parse'
import {escapeRegExp} from 'lodash/string'
import {REGEX as QUERY_REGEX} from '../query/constants'

// This regex is taken from "marked" module almost "as it is".
// At the beginning "^!?" has been removed to match all objects.
// We don't use full md parser because its harder to setup it to ignore
// everything except of links.
const linkRegExp = /\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/g

function tagWithoutLabel(tag, type) {
  return tag[0] === getTrigger(type) ? tag.substr(1) : tag
}

function tagWithLabel(tag, type) {
  const label = getTrigger(type)
  return tag[0] === label ? tag : label + tag
}

/**
 * Get data map from md object.
 */
function toData(text, url) {
  const parts = url.slice(5).split('|')

  return {
    id: tagWithoutLabel(parts[2], parts[1]),
    name: tagWithoutLabel(text, parts[1]),
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

/**
 * Parse all md links and convert them to array of data.
 */
export function parseAndReplace(content) {
  const configs = []
  let text = content.replace(linkRegExp, (match, tag, url) => {
    const config = toData(tag, url)
    configs.push(config)
    return tagWithLabel(tag, config.type)
  })

  text = text.replace(/:\w+:/g, (match) => {
    configs.push({
      type: 'emoji',
      shortname: match,
      content: match
    })
    return match
  })

  return {configs, text}
}

/**
 * Parse emoji smiles, like ':smile:'
 */
export function parseEmoji(content) {
  let data = []
  const emoji = content.match(/:\w+:/g)
  if (emoji) {
    data = emoji.map(token => {
      return {
        type: 'emoji',
        shortname: token,
        content: token
      }
    })
  }
  return data
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

      if ((nextSymbol && nextSymbol.match(/\s/)) || // match whitespace and line break too
          nextSymbolIndex < 0 ||
          nextSymbolIndex === string.length) {
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
