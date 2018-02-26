import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {injectIntl} from 'react-intl'

import Items from './Items'

@injectIntl
export default class Header extends PureComponent {
  static propTypes = {
    showSidebar: PropTypes.func.isRequired,
    updateMessageSearchQuery: PropTypes.func.isRequired
  }

  onFocusMessageSearch = ({target}) => {
    this.props.showSidebar('search')
    this.props.updateMessageSearchQuery(target.value)
  }

  onChangeMessageSearch = ({target}) => {
    this.props.updateMessageSearchQuery(target.value)
  }

  render() {
    return (
      <Items
        {...this.props}
        onChangeMessageSearch={this.onChangeMessageSearch}
        onFocusMessageSearch={this.onFocusMessageSearch}
      />
    )
  }
}
