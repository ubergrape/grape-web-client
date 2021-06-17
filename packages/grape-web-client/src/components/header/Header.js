import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { injectIntl } from 'react-intl'

import Items from './Items'

@injectIntl
export default class Header extends PureComponent {
  static propTypes = {
    showSidebar: PropTypes.func.isRequired,
    updateMessageSearchQuery: PropTypes.func.isRequired,
    showVideoConferenceWarning: PropTypes.func.isRequired,
    isMemberOfAnyRooms: PropTypes.bool.isRequired,
  }

  onFocusMessageSearch = ({ target }) => {
    this.props.showSidebar('search')
    this.props.updateMessageSearchQuery(target.value)
  }

  onChangeMessageSearch = ({ target }) => {
    this.props.updateMessageSearchQuery(target.value)
  }

  render() {
    return (
      <div>
        {this.props.isMemberOfAnyRooms && (
          <Items
            {...this.props}
            onChangeMessageSearch={this.onChangeMessageSearch}
            onFocusMessageSearch={this.onFocusMessageSearch}
          />
        )}
      </div>
    )
  }
}
