import {Component, PropTypes} from 'react'
import pick from 'lodash/object/pick'
import emoji from 'markdown-it-emoji'
import shallowCompare from 'react-addons-shallow-compare'

import createRender, {
  renderTag,
  convertEmoji,
  convertCustomEmojis
} from './createRender'
import {nonStandardProps} from './utils'

export default class Grapedown extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    customEmojis: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.mdRender = createRender({
      onIterate: this.renderTag,
      convertRules: {
        emoji: this.renderEmoji,
        inline: this.renderInline
      },
      plugins: [emoji]
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  renderTag = (tag, props, children) => {
    return renderTag(tag, {...props, ...pick(this.props, nonStandardProps)}, children)
  }

  renderEmoji = ({markup}) => {
    return convertEmoji(markup)
  }

  renderInline = (token, attrs, children) => {
    return convertCustomEmojis(children, this.props.customEmojis)
  }

  render() {
    const {text} = this.props
    if (!text) return null
    return this.mdRender(text)
  }
}
