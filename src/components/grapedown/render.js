import {mdReact} from 'markdown-react-js'
import emoji from 'markdown-it-emoji'
import pick from 'lodash/object/pick'
import {defineMessages} from 'react-intl'
import forcebreak from '../../utils/markdown-it-plugins/forcebreak'

import {
  renderTag,
  renderEmoji,
  renderCustomEmojis,
  renderInlineImage
} from './renderers'
import {nonStandardProps} from './utils'

const messages = defineMessages({
  imageWithDescr: {
    id: 'imageWithDescr',
    defaultMessage: 'Image: [{description}]',
    description: '**Used when rendered inline image from markdown with description.**'
  },
  imageWithoutDescr: {
    id: 'imageWithoutDescr',
    defaultMessage: 'Image: [No Description]',
    description: '**Used when rendered inline image from markdown without description.**'
  }
})

/**
 * Class with `render` metod which accepts MD text.
 */
class Renderer {
  constructor() {
    this.renderer = mdReact({
      presetName: 'commonmark',
      disableRules: ['list', 'heading'],
      markdownOptions: {
        linkify: true,
        html: false,
        breaks: true
      },
      onIterate: this.renderTag,
      convertRules: {
        emoji: this.renderEmoji,
        inline: this.renderInline,
        image: this.renderInlineImage,
        link: this.renderLinks
      },
      plugins: [emoji, forcebreak]
    })
  }

  renderTag = (tag, props, children) => {
    const handler = this.props.renderTag || renderTag
    return handler(tag, {...props, ...pick(this.props, nonStandardProps)}, children)
  }

  renderEmoji = ({markup}) => renderEmoji(markup)

  renderInline = (token, attrs, children) => renderCustomEmojis(children, this.props.customEmojis)

  renderInlineImage = (token, attrs, children) => {
    const {formatMessage} = this.props.intl
    let message = messages.imageWithoutDescr
    let values
    if (children.length) {
      message = messages.imageWithDescr
      values = {description: children[0]}
    }
    return renderInlineImage(attrs.src, formatMessage(message, values))
  }

  render(props) {
    this.props = props
    return this.renderer(props.text)
  }
}

const renderer = new Renderer()
export default ::renderer.render
