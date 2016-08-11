import {createElement} from 'react'
import {mdReact} from 'markdown-react-js'

import jsEmoji from '../emoji/emoji'
import {isGrapeUrl} from 'grape-web/lib/grape-objects'
import omit from 'lodash/object/omit'
import {nonStandardProps} from './utils'
import camelCaseKeys from 'camelcase-keys';

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
  display: 'inline-block',
  width: '16px',
  height: '16px'
}

export function convertEmoji(markup) {
  jsEmoji.init_colons()
  const image = jsEmoji.map.colons[markup]
  const styles = jsEmoji.get_use_sheet_style_data(image)
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
