import React, {createElement} from 'react'
import {isGrapeUrl} from 'grape-web/lib/grape-objects'
import omit from 'lodash/object/omit'
import {matchPath} from 'react-router-dom'
import parseUrl from 'grape-web/lib/parse-url'

import jsEmoji, {
  getEmojiSliceStyle,
  style
} from '../emoji/emoji'
import conf from '../../conf'
import CurrentChatLink from './CurrentChatLink'
import {channelRoute} from '../../constants/routes'

import {
  isChatUrl,
  nonStandardProps,
  replaceCustomEmojis
} from './utils'

import GrapeObject from './GrapeObject'
import {LineBreak} from '../line-break'

export function renderTag(tag, props, children) {
  let nextProps = props

  if (tag === 'br' && nextProps.forcebreak) {
    return createElement(LineBreak, {key: nextProps.key})
  }

  // Open link in a new window if it is not a grape url.
  if (tag === 'a') {
    if (isGrapeUrl(nextProps.href)) {
      return createElement(GrapeObject, nextProps, children)
    }
    if (conf.embed && isChatUrl(nextProps.href)) {
      const match = matchPath(parseUrl(nextProps.href).pathname, {
        path: channelRoute
      })
      if (Number(match.params.channelId) === conf.channelId) {
        return (
          <CurrentChatLink
            key={nextProps.key}
            href={nextProps.href}
            channelId={Number(match.params.channelId)}
            messageId={match.params.messageId}
            onClick={nextProps.goToMessageEmbedded}
          />
        )
      }
    }
    if (conf.embed || !isChatUrl(nextProps.href)) {
      nextProps = {...nextProps, target: '_blank'}
    }
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
    {href, alt: text, target: '_blank'},
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
