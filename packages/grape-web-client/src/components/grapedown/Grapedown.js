import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { injectIntl } from 'react-intl'

import render from './render'

@injectIntl
export default class Grapedown extends PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
  }

  render() {
    const { text } = this.props
    if (!text) return null
    return render(this.props)
  }
}
