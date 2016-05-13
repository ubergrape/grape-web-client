import {mdReact} from 'markdown-react-js'
import emoji from 'markdown-it-emoji'

const render = mdReact({
  presetName: 'commonmark',
  disableRules: ['list', 'image'],
  markdownOptions: {
    linkify: true
  },
  plugins: [emoji]
})

export default function GrapeDown(props) {
  return render(props.text)
}
