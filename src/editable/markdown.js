import * as objects from '../objects'
import {getLabel} from '../objects/utils'

// This regex is taken from "marked" module almost "as it is".
// At the beginning "^!?" has been removed to match all objects.
// We don't use full md parser because its harder to setup it to ignore
// everything except of links.
const linkRegExp = /\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/g

/**
 * Replace md links which use cg protocol to our html representation.
 */
export function replace(content) {
  return content.replace(linkRegExp, (match, text, url) => {
    if (url.indexOf('cg://') === 0) return toHTML(text, url)
    return match
  })
}

/**
 * Parse all md links and convert them to array of data.
 */
export function parseAndReplace(content) {
  let configs = []
  let text = content.replace(linkRegExp, (match, text, url) => {
    let config = toData(text, url)
    configs.push(config)
    return getLabel(config.type) + text
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

/**
 * Get data map from md object.
 */
function toData(text, url) {
  let parts = url.slice(5).split('|')
  return {
    name: text,
    service: parts[0],
    type: parts[1],
    id: parts[2],
    url: parts[3]
  }
}

/**
 * Build html element for md object.
 */
function toHTML(text, url) {
  let data = toData(text, url)
  return objects.create('search', data).toHTML()
}
