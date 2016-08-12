import {createElement} from 'react'
import {mdReact} from 'markdown-react-js'
import isEmpty from 'lodash/lang/isEmpty'
import last from 'lodash/array/last'

import jsEmoji from '../emoji/emoji'
import {isGrapeUrl} from 'grape-web/lib/grape-objects'
import omit from 'lodash/object/omit'
import {nonStandardProps} from './utils'
import camelCaseKeys from 'camelcase-keys'
import {emojiSheet} from '../../constants/images'

import {isChatUrl} from './utils'
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

const style = {
  fontSize: 21,
  display: 'inline-block',
  width: '1em',
  height: '1em'
}

export function getEmojiSliceStyle(id) {
  const px = jsEmoji.data[id][4]
  const py = jsEmoji.data[id][5]
  const mul = 100 / (jsEmoji.sheet_size - 1)

  return {
    backgroundPosition: `${mul * px}% ${mul * py}%`,
    backgroundSize: jsEmoji.sheet_size + '00%',
    backgroundImage: `url(${emojiSheet})`
  }
}


export function convertEmoji(markup) {
  jsEmoji.init_colons()
  const image = jsEmoji.map.colons[markup]
  const styles = getEmojiSliceStyle(image)
  if (!image || !styles) return `:${markup}:`

  return [[
    'span',
    {
      style: {
        ...camelCaseKeys(styles),
        ...style
      }
    }
  ]]
}

export const emojiRegex = /(^|\s):[a-zA-Z0-9-_]+:(?=($|\s))/g

export function convertCustomEmojis(children, customEmojis) {
  return children.reduce((newChildren, child) => {
    if (typeof child !== 'string') {
      newChildren.push(child)
      return newChildren
    }
    const matches = child.match(emojiRegex)
    if (matches) {
      const replaceMap = matches.reduce((map, match) => {
        const name = match.replace(/:/g, '').trim()
        if (!customEmojis[name]) return map
        map[`:${name}:`] = [
          'img',
          {
            src: customEmojis[name],
            alt: match,
            style
          }
        ]
        return map
      }, {})

      if (isEmpty(replaceMap)) {
        newChildren.push(child)
        return newChildren
      }

      const replaced = child.split(' ').map(word => {
        return replaceMap[word] ? replaceMap[word] : word
      })

      const replacedLastIndex = replaced.length - 1
      let replacedIndex = 0
      const newChild = replaced.reduce((joined, item, index) => {
        let isLastLoop = false
        if (replacedIndex === replacedLastIndex) isLastLoop = true
        replacedIndex++

        const lastChild = last(joined)
        if (typeof item !== 'string') {
          joined.push(item)
          return joined
        }

        const spacedItem = item + (isLastLoop ? '' : ' ')
        if (typeof lastChild !== 'string') {
          joined.push(spacedItem)
          return joined
        }

        joined[index] = lastChild + spacedItem
        return joined
      }, [])

      return newChildren.concat(newChild)
    }
    newChildren.push(child)
    return newChildren
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
