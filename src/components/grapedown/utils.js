import isEmpty from 'lodash/lang/isEmpty'
import joinStrings from 'join-strings-in-array'
import parseUrl from 'grape-web/lib/parse-url'
import {emojiRegex, style} from '../emoji/emoji'

export function isChatUrl(url) {
  const {host} = window.location
  const urlObj = parseUrl(url)
  return urlObj.host === host && urlObj.pathname.indexOf('/chat') === 0
}

export const nonStandardProps = ['user', 'customEmojis', 'forcebreak']

/**
 * Coverts `:emoji:`-strings that are in `customEmojis` map in to the images.
 */
export function replaceCustomEmojis(node, customEmojis) {
  const emojis = node.match(emojiRegex)
  if (!emojis) return node

  const replaceMap = emojis.reduce((map, emoji) => {
    const name = emoji.trim().replace(/:/g, '')
    if (!customEmojis[name]) return map
    // eslint-disable-next-line no-param-reassign
    map[`:${name}:`] = [
      'img',
      {
        src: customEmojis[name],
        alt: emoji,
        style: {
          ...style,
          fontSize: '1.5em'
        }
      }
    ]
    return map
  }, {})

  if (isEmpty(replaceMap)) return node

  const replaced = node.split(' ').map(word => (replaceMap[word] ? replaceMap[word] : word))

  return joinStrings(replaced)
}
