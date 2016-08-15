import isEmpty from 'lodash/lang/isEmpty'
import joinStrings from 'join-strings-in-array'
import {emojiRegex, style} from '../emoji/emoji'

const parser = document.createElement('a')
const grapeProtocol = 'cg:'
const chatPath = '/chat'

export function isGrapeUrl(url) {
  parser.href = url
  return parser.protocol === grapeProtocol
}

export function isChatUrl(url) {
  const {host, pathname} = window.location
  parser.href = url
  return parser.host === host && pathname.indexOf(chatPath) === 0
}

export const nonStandardProps = ['user', 'customEmojis']

/**
 * Coverts `:emoji:`-strings that are in `customEmojis` map in to the images.
 */
export function replaceCustomEmojis(node, customEmojis) {
  const emojis = node.match(emojiRegex)
  if (!emojis) return node

  const replaceMap = emojis.reduce((map, emoji) => {
    const name = emoji.trim().replace(/:/g, '')
    if (!customEmojis[name]) return map
    map[`:${name}:`] = [
      'img',
      {
        src: customEmojis[name],
        alt: emoji,
        style
      }
    ]
    return map
  }, {})

  if (isEmpty(replaceMap)) return node

  const replaced = node.split(' ').map(word => {
    return replaceMap[word] ? replaceMap[word] : word
  })

  return joinStrings(replaced)
}
