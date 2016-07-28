import {Component, PropTypes} from 'react'
import pick from 'lodash/object/pick'

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

  renderTag = (tag, props, children) => {
    return renderTag(tag, {...props, ...pick(this.props, nonStandardProps)}, children)
  }

  render() {
    return this.mdRender(this.props.text)
  }
}
