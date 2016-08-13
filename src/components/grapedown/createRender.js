import {createElement} from 'react'
import {mdReact} from 'markdown-react-js'
import {isGrapeUrl} from 'grape-web/lib/grape-objects'
import omit from 'lodash/object/omit'

import jsEmoji, {
  getEmojiSliceStyle,
  theme as emojiTheme
} from '../emoji/emoji'
import {
  isChatUrl,
  nonStandardProps,
  replaceCustomEmoji
} from './utils'
import GrapeObject from './GrapeObject'

export function renderTag(tag, props, children) {
  // Open link in a new window if it is not a grape url.
  if (tag === 'a') {
    if (isGrapeUrl(props.href)) {
      return createElement(GrapeObject, props, children)
    }
    if (!isChatUrl(props.href)) {
      props.target = '_blank'
    }
  }

  return createElement(
    tag,
    omit(props, nonStandardProps),
    children && children.length ? children : undefined
  )
}

/**
 * Coverts known `:emoji:`-strings in to the image.
 */
export function convertEmoji(markup) {
  const image = jsEmoji.map.colons[markup]
  const styles = getEmojiSliceStyle(image)
  if (!image || !styles) return `:${markup}:`

  return [[
    'span',
    {
      style: {
        ...styles,
        ...emojiTheme.style
      }
    }
  ]]
}

/**
 * Coverts known customEmoji in to the image.
 */
export function convertCustomEmojis(children, customEmojis) {
  return children.reduce((converted, child) => {
    if (typeof child !== 'string') {
      converted.push(child)
      return converted
    }
    const replaced = replaceCustomEmoji(child, customEmojis)
    if (typeof replaced === 'string') {
      converted.push(replaced)
      return converted
    }
    return converted.concat(replaced)
  }, [])
}

const defaults = {
  presetName: 'commonmark',
  disableRules: ['list', 'image'],
  markdownOptions: {
    linkify: true,
    html: false,
    breaks: true
  },
  onIterate: renderTag
}

/**
 * Returns a render function which accepts MD text.
 */
export default function createRender(options = {}) {
  return mdReact({...defaults, ...options})
}
