import {createElement} from 'react'
import {mdReact} from 'markdown-react-js'
import emoji from 'markdown-it-emoji'
import {isGrapeUrl} from 'grape-web/lib/grape-objects'
import omit from 'lodash/object/omit'
import {nonStandardProps} from './utils'

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

  return createElement(tag, omit(props, nonStandardProps), children)
}

const defaults = {
  presetName: 'commonmark',
  disableRules: ['list', 'image'],
  markdownOptions: {
    linkify: true,
    html: false
  },
  plugins: [emoji],
  onIterate: renderTag
}

/**
 * Returns a render function which accepts MD text.
 */
export default function createRender(options = {}) {
  return mdReact({...defaults, ...options})
}
