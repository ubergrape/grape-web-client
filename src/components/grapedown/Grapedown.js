import {createElement} from 'react'
import {mdReact} from 'markdown-react-js'
import emoji from 'markdown-it-emoji'
import {isGrapeUrl} from 'grape-web/lib/grape-objects'

import {isChatUrl} from './utils'
import GrapeObject from './GrapeObject'


const render = mdReact({
  presetName: 'commonmark',
  disableRules: ['list', 'image'],
  markdownOptions: {
    linkify: true,
    html: false
  },
  plugins: [emoji],
  onIterate: (tag, props, children) => {
    // Open link in a new window if it is not a grape url.
    if (tag === 'a') {
      if (isGrapeUrl(props.href)) {
        return createElement(GrapeObject, props, children)
      }
      if (!isChatUrl(props.href)) {
        props.target = '_blank'
      }
    }
    return createElement(tag, props, children)
  }
})

export default function Grapedown(props) {
  return render(props.text)
}
