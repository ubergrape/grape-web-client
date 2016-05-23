import {createElement} from 'react'
import {mdReact} from 'markdown-react-js'
import emoji from 'markdown-it-emoji'

import {isGrapeUrl, isChatUrl} from './utils'

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
        // FIXME render grape object.
        return
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
