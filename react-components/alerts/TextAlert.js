import React, {Component, PropTypes} from 'react'
import getAlertText from './getAlertText'

export default class TextAlert extends Component {
  static propTypes = {
    type: PropTypes.string
  }

  render() {
    return <span>{getAlertText(this.props.type)}</span>
  }
}
