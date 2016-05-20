import {createElement} from 'react'
import {mdReact} from 'markdown-react-js'
import emoji from 'markdown-it-emoji'

const render = mdReact({
  presetName: 'commonmark',
  disableRules: ['list', 'image'],
  markdownOptions: {
    linkify: true,
    html: false
  },
  plugins: [emoji],
  onIterate: (tag, props, children) => {
    // Always open link in new window.
    if (tag === 'a') props.target = '_blank'

    return createElement(tag, props, children)
  }
})

export default function GrapeDown(props) {
  return render(props.text)
}
