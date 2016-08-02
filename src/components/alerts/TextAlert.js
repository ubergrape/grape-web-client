import {Component, PropTypes} from 'react'
import getAlertText from './getAlertText'

export default class TextAlert extends Component {
  static propTypes = {
    type: PropTypes.string
  }

  render() {
    return getAlertText(this.props.type)
  }
}
