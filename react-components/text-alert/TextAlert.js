import React, {Component, PropTypes} from 'react'
import getText from './getText'

export default class TextAlert extends Component {
  static propTypes = {
    type: PropTypes.string
  }

  render() {
    return <span>{getText(this.props.type)}</span>
  }
}
