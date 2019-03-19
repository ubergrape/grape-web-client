import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { injectIntl } from 'react-intl'

import Items from './Items'

class Header extends PureComponent {
  static propTypes = {
    showSidebar: PropTypes.func.isRequired,
    updateMessageSearchQuery: PropTypes.func.isRequired,
    showVideoConferenceWarning: PropTypes.func.isRequired,
    isMemberOfAnyRooms: PropTypes.bool.isRequired,
    channel: PropTypes.object.isRequired,
    orgFeatures: PropTypes.object,
  }

  static defaultProps = {
    orgFeatures: undefined,
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
            orgFeatures={this.props.orgFeatures}
          />
        )}
      </div>
    )
  }
}

export default injectIntl(Header)
