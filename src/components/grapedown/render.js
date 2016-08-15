import {mdReact} from 'markdown-react-js'
import emoji from 'markdown-it-emoji'
import pick from 'lodash/object/pick'

import {
  renderTag,
  renderEmoji,
  renderCustomEmojis
} from './renderers'
import {nonStandardProps} from './utils'

/**
 * Class with `render` metod which accepts MD text.
 */
class Renderer {
  constructor() {
    this.renderer = mdReact({
      presetName: 'commonmark',
      disableRules: ['list', 'image'],
      markdownOptions: {
        linkify: true,
        html: false,
        breaks: true
      },
      onIterate: this.renderTag,
      convertRules: {
        emoji: this.renderEmoji,
        inline: this.renderInline
      },
      plugins: [emoji]
    })
  }

  renderTag = (tag, props, children) => {
    const handler = this.props.renderTag || renderTag
    return handler(tag, {...props, ...pick(this.props, nonStandardProps)}, children)
  }

  renderEmoji = ({markup}) => {
    return renderEmoji(markup)
  }

  renderInline = (token, attrs, children) => {
    return renderCustomEmojis(children, this.props.customEmojis)
  }

  render(props) {
    this.props = props
    return this.renderer(props.text)
  }
}

const renderer = new Renderer()
export default ::renderer.render
