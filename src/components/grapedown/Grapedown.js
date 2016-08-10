import {Component, PropTypes} from 'react'
import pick from 'lodash/object/pick'
import shallowCompare from 'react-addons-shallow-compare'

import createRender, {renderTag} from './createRender'
import {nonStandardProps} from './utils'

export default class Grapedown extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.mdRender = createRender({onIterate: this.renderTag})
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  renderTag = (tag, props, children) => {
    return renderTag(tag, {...props, ...pick(this.props, nonStandardProps)}, children)
  }

  render() {
    const {text} = this.props
    if (!text) return null
    return this.mdRender(text)
  }
}
