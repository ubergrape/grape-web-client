import PropTypes from 'prop-types'
import {PureComponent} from 'react'
import getAlertText from './getAlertText'

export default class TextAlert extends PureComponent {
  static propTypes = {
    type: PropTypes.string
  }

  render() {
    return getAlertText(this.props.type)
  }
}
