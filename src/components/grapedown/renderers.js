import React, {createElement} from 'react'
import {isGrapeUrl} from 'grape-web/lib/grape-objects'
import omit from 'lodash/object/omit'
import {Link} from 'react-router-dom'

import jsEmoji, {
  getEmojiSliceStyle,
  style
} from '../emoji/emoji'

import {
  nonStandardProps,
  replaceCustomEmojis
} from './utils'

import GrapeObject from './GrapeObject'
import {LineBreak} from '../line-break'

export function renderTag(tag, props, children) {
  const nextProps = props

  if (tag === 'br' && nextProps.forcebreak) {
    return createElement(LineBreak, {key: nextProps.key})
  }

  // Open link in a new window if it is not a grape url.
  if (tag === 'a') {
    const {href, key} = nextProps
    if (isGrapeUrl(nextProps.href)) {
      return createElement(GrapeObject, nextProps, children)
    }
    return (
      <Link
        to={href}
        key={key}
      >
        {children}
      </Link>
    )
  }

  return createElement(
    tag,
    omit(nextProps, nonStandardProps),
    children && children.length ? children : undefined
  )
}

/**
 * We render inline images as a link as we don't really support them.
 */
export function renderInlineImage(href, text) {
  return [[
    'a',
    {href, alt: text},
    ['text', text]
  ]]
}

/**
 * Coverts known `:emoji:`-strings in to the image.
 */
export function renderEmoji(markup) {
  // In case some client sends an emoji web client doesn't know.
  const image = jsEmoji.map.colons[markup]
  if (!image) return `:${markup}:`
  const styles = getEmojiSliceStyle(image)
  if (!styles) return `:${markup}:`

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
