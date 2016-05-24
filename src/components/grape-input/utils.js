import {get as getEmoji, REGEX as EMOJI_REGEX} from '../emoji'
import {create as createObject, getOptions as getObjectOptions} from 'grape-web/lib/grape-objects'

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
 * Parse all grape-protocol markdown links, emoji and
 * convert them to special data object.
 */
export function fromMarkdown(md) {
  const objects = {}

  let value = md.replace(linkRegExp, (match, token, url) => {
    const options = getObjectOptions(token, url)
    if (!options) return match
    const object = createObject(options.type, options)
    objects[object.content] = object

    return object.content
  })

  value = value.replace(EMOJI_REGEX, match => {
    const options = getEmojiData(match.trim())
    objects[options.content] = createObject(options.type, options)
    return match
  })

  return {objects, value}
}
