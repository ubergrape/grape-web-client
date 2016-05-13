import {mdReact} from 'markdown-react-js'

const render = mdReact({
  presetName: 'commonmark',
  disableRules: ['list', 'image'],
  markdownOptions: {
    linkify: true
  }
})

export default function GrapeDown(props) {
  return render(props.text)
}
