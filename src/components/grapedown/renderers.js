import React, {createElement} from 'react'
import {isGrapeUrl} from 'grape-web/lib/grape-objects'
import omit from 'lodash/object/omit'
import random from 'lodash/number/random'

import jsEmoji, {
  getEmojiSliceStyle,
  style
} from '../emoji/emoji'

import {
  isChatUrl,
  nonStandardProps,
  replaceCustomEmojis
} from './utils'

import GrapeObject from './GrapeObject'
import {LineBreak} from '../line-break'

export const emptyLine = `%%${random(1e10)}%%`
const emptyLineRegexp = new RegExp(emptyLine, 'g')

export function renderTag(tag, props, children) {
  let cldrn
  if (children) {
    cldrn = children.reduce((acc, child, index) => {
      if (typeof child !== 'string') {
        acc.push(child)
      } else if (tag === 'p') {
        const parts = child.split(emptyLine)
        acc.push(parts[0])
        if (parts.length > 1) {
          acc.push(<LineBreak key={`${index}-0`}/>)
          acc.push(<LineBreak key={`${index}-1`}/>)
        }
      } else {
        acc.push(child.replace(emptyLineRegexp, ''))
      }

      return acc
    }, [])
  }

  // Open link in a new window if it is not a grape url.
  if (tag === 'a') {
    if (isGrapeUrl(props.href)) {
      return createElement(GrapeObject, props, cldrn)
    }
    if (!isChatUrl(props.href)) {
      props.target = '_blank'
    }
  }

  return createElement(
    tag,
    omit(props, nonStandardProps),
    cldrn && cldrn.length ? cldrn : undefined
  )
}

/**
 * We render inline images as a link as we don't really support them.
 */
export function renderInlineImage(href, text) {
  return [[
    'a',
    {href, alt: text, target: '_blank'},
    ['text', text]
  ]]
}

/**
 * Coverts known `:emoji:`-strings in to the image.
 */
export function renderEmoji(markup) {
  const image = jsEmoji.map.colons[markup]
  const styles = getEmojiSliceStyle(image)
  if (!image || !styles) return `:${markup}:`

  return [[
    'span',
    {
      style: {
        ...styles,
        ...style,
        fontSize: '1.5em'
      }
    }
  ]]
}

/**
 * Coverts known customEmojis in md to the images.
 */
export function renderCustomEmojis(children, customEmojis) {
  return children.reduce((converted, child) => {
    if (typeof child !== 'string') {
      converted.push(child)
      return converted
    }
    const replaced = replaceCustomEmojis(child, customEmojis)
    if (typeof replaced === 'string') {
      converted.push(replaced)
      return converted
    }
    return converted.concat(replaced)
  }, [])
}
