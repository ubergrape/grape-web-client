import {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'

import Renderer from './Renderer'

export default class Grapedown extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    customEmojis: PropTypes.object.isRequired
  }

  static defaultProps = {
    user: {},
    customEmojis: {}
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {text} = this.props
    if (!text) return null
    return Renderer.render(this.props)
  }
}
