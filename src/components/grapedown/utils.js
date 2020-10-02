import joinStrings from 'join-strings-in-array'

import { emojiRegex, style } from '../emoji/emoji'

export const nonStandardProps = [
  'channel',
  'user',
  'tag',
  'customEmojis',
  'forcebreak',
]

const replaceEmoji = (emoji, customEmojis) => {
  const name = emoji.trim().replace(/:/g, '')
  if (!customEmojis[name]) return emoji
  // eslint-disable-next-line no-param-reassign
  return [
    'img',
    {
      src: customEmojis[name],
      alt: emoji,
      style: {
        ...style,
        fontSize: '1.5em',
      },
    },
  ]
}

/**
 * Coverts `:emoji:`-strings that are in `customEmojis` map in to the images.
 */
export function replaceCustomEmojis(node, customEmojis) {
  const emojis = node.match(emojiRegex)
  if (!emojis) return node

  const replaced = node
    .split(' ')
    .map(word => replaceEmoji(word, customEmojis) || word)

  return joinStrings(replaced)
}
