import { mdReact } from 'markdown-react-js'
import { pick } from 'lodash'
import { defineMessages } from 'react-intl'
import emojiPlugin from './markdown-it-emoji'
import forcebreakPlugin from '../../../utils/markdown-it-plugins/forcebreak'
import jsEmoji from '../emoji/emoji'

import {
  renderTag,
  renderEmoji,
  renderCustomEmojis,
  renderInlineImage,
} from './renderers'
import { nonStandardProps } from './utils'

const messages = defineMessages({
  imageWithDescr: {
    id: 'imageWithDescr',
    defaultMessage: 'Image: [{description}]',
    description:
      '**Used when rendered inline image from markdown with description.**',
  },
  imageWithoutDescr: {
    id: 'imageWithoutDescr',
    defaultMessage: 'Image: [No Description]',
    description:
      '**Used when rendered inline image from markdown without description.**',
  },
})

/**
 * Class with `render` metod which accepts MD text.
 */
class Renderer {
  constructor() {
    this.renderer = mdReact({
      presetName: 'commonmark',
      disableRules: ['list', 'heading'],
      // linkify has to be additional to the option be enabled as
      // a rule since commonmark disables it by default
      // see https://github.com/markdown-it/markdown-it/issues/367
      // and for some reason strikethrough should be enabled too, but
      // documentation says it enabled by default
      enableRules: ['linkify', 'strikethrough'],
      markdownOptions: {
        linkify: true,
        html: false,
        breaks: true,
      },
      onIterate: this.renderTag,
      convertRules: {
        emoji: this.renderEmoji,
        inline: this.renderInline,
        image: this.renderInlineImage,
      },
      plugins: [emojiPlugin, forcebreakPlugin],
    })
  }

  // In case there are no children we need to set it to an empty array
  // to make sure createElement gets a parameter other than undefined or null.
  renderTag = (tag, props, children = []) => {
    const handler = this.props.renderTag || renderTag
    return handler(
      tag,
      { ...props, ...pick(this.props, nonStandardProps) },
      children,
    )
  }

  renderEmoji = ({ markup }) => renderEmoji(markup)

  renderInline = (token, attrs, children) =>
    renderCustomEmojis(children, this.props.customEmojis)

  renderInlineImage = (token, attrs, children) => {
    const { formatMessage } = this.props.intl
    let message = messages.imageWithoutDescr
    let values
    if (children.length) {
      message = messages.imageWithDescr
      values = { description: children[0] }
    }
    return renderInlineImage(attrs.src, formatMessage(message, values))
  }

  render(props) {
    this.props = props
    if (navigator.platform === 'Win32') {
      return this.renderer(jsEmoji.replace_unified(this.props.text))
    }
    return this.renderer(this.props.text)
  }
}

const renderer = new Renderer()
export default renderer.render.bind(renderer)
