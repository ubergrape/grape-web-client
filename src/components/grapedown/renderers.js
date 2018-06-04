import React, {createElement} from 'react'
import {isGrapeUrl} from 'grape-web/lib/grape-objects'
import omit from 'lodash/object/omit'
import {Link} from 'grape-web/lib/router'

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
  const {href, key, forcebreak, user} = props

  if (tag === 'br' && forcebreak) {
    return createElement(LineBreak, {key})
  }

  // Open link in a new window if it is not a grape url.
  if (tag === 'a') {
    if (isGrapeUrl(href)) {
      return createElement(GrapeObject, props, children)
    }

    // Open pm links only if it's somebody else's user.id
    if (href.startsWith('/chat/pm/')) {
      const [pmUserId] = href.match(/\d+$/) || []
      if (user.id === Number(pmUserId)) return <span>{children}</span>
    }

    return (
      <Link to={href} key={key}>
        {children}
      </Link>
    )
  }

  return createElement(
    tag,
    omit(props, nonStandardProps),
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
