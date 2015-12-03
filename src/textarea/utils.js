import * as objects from '../objects'
import {getLabel} from '../objects/utils'

// This regex is taken from "marked" module almost "as it is".
// At the beginning "^!?" has been removed to match all objects.
// We don't use full md parser because its harder to setup it to ignore
// everything except of links.
const linkRegExp = /\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/g

/**
 * Parse all md links and convert them to array of data.
 */
export function parseAndReplace(content) {
  let configs = []
  let text = content.replace(linkRegExp, (match, text, url) => {
    let config = toData(text, url)
    configs.push(config)
    return tagWithLabel(text, config.type)
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
  let emoji = content.match(/:\w+:/g)
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
      let nextSymbol = string[nextSymbolIndex]

      if ((nextSymbol && nextSymbol.match(/\s/)) || // match whitespace and line break too
          nextSymbolIndex < 0 ||
          nextSymbolIndex === string.length) {
        position.push(previousSymbolIndex)
        tailFound = true
        break
      }

      token.text = position.length ?
              token.text + string[nextSymbolIndex] :
              string[nextSymbolIndex] + token.text

      previousSymbolIndex = nextSymbolIndex
      nextSymbolIndex = position.length ? nextSymbolIndex + 1 : nextSymbolIndex - 1
    }
  }

  return Boolean(token.text) && token
}

export function indexesOf(sub, str) {
    let startIndex = 0
    let index

    const subLen = sub.length

    const indices = []

    while ((index = str.indexOf(sub, startIndex)) > -1) {
        startIndex = index + subLen
        indices.push([index, startIndex])
    }
    return indices
}

/**
 * Check if an element is focused.
 */
export function isFocused(node) {
  return node === document.activeElement
}


/**
 * Get data map from md object.
 */
function toData(text, url) {
  let parts = url.slice(5).split('|')

  return {
    name: tagWithoutLabel(text, parts[1]),
    service: parts[0],
    type: parts[1],
    id: tagWithoutLabel(parts[2], parts[1]),
    url: parts[3]
  }
}

function tagWithoutLabel(tag, type) {
  return tag[0] === getLabel(type) ? tag.substr(1) : tag
}

function tagWithLabel(tag, type) {
  let label = getLabel(type)
  return tag[0] === label ? tag : label + tag
}
