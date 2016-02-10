import {QUERY_REGEX, EMOJI_REGEX} from '../query/constants'
import {get as getEmoji} from '../emoji'
import {create as createObject} from '../objects'
import {grapeProtocolRegExp} from '../objects/constants'
import {getTrigger} from '../objects/utils'
import parseQuery from '../query/parse'

// This regex is taken from "marked" module almost "as it is".
// At the beginning "^!?" has been removed to match all objects.
// We don't use full md parser because its harder to setup it to ignore
// everything except of links.
const linkRegExp = /\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\(\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/g

function getEmojiData(token) {
  return {
    type: 'emoji',
    shortname: token,
    content: token
  }
}

/**
 * Parse emoji smiles, like ':smile:'
 */
function parseEmoji(content) {
  let data = []
  const emoji = content.match(EMOJI_REGEX)
  if (emoji) data = emoji.map(item => getEmojiData(item.trim()))
  return data
}

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

export function toMarkdown(tokens, objects) {
  return tokens.map(token => {
    return objects[token] ? objects[token].str : token
  }).join('')
}

/**
 * Parse all md links and convert them to array of data.
 */
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

/**
 * Return query if value is query or false
 */
export function getQuery(token) {
  const isQuery = Boolean(token && token.match(QUERY_REGEX))
  if (isQuery) return parseQuery(token)
}
