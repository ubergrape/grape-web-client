import {Component, PropTypes} from 'react'
import pick from 'lodash/object/pick'
import emoji from 'markdown-it-emoji'
import createRender, {renderTag, convertEmoji} from './createRender'
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
        emoji: this.renderEmoji
      },
      plugins: [{
        plugin: emoji,
        args: [{
          putin: ':putin:'
        }]
      }]

    })
  }

  renderTag = (tag, props, children) => {
    return renderTag(tag, {...props, ...pick(this.props, nonStandardProps)}, children)
  }

  renderEmoji = ({markup}) => {
    return convertEmoji(markup, this.props.customEmojis)
  }

  render() {
    const r = this.mdRender(this.props.text)
    // console.log(r)
    return r
  }
}
