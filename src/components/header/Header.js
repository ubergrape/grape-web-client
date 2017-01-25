import React, {PureComponent, PropTypes} from 'react'
import {injectIntl} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './theme'
import Items from './Items'

@injectSheet(styles)
@injectIntl
export default class Header extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object,
    channel: PropTypes.object.isRequired,
    mate: PropTypes.object.isRequired,
    favorite: PropTypes.object.isRequired,
    sidebar: PropTypes.oneOfType([
      PropTypes.string,
      React.PropTypes.bool
    ]),
    mentions: PropTypes.number,
    showChannelMembersInvite: PropTypes.func,
    updateMessageSearchQuery: PropTypes.func,
    showInSidebar: PropTypes.func,
    hideSidebar: PropTypes.func
  }

  onFocusMessageSearch = ({target}) => {
    this.props.showInSidebar('search')
    this.props.updateMessageSearchQuery(target.value)
  }

  onChangeMessageSearch = ({target}) => {
    this.props.updateMessageSearchQuery(target.value)
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <Items
        {...this.props}
        onChangeMessageSearch={this.onChangeMessageSearch}
        onFocusMessageSearch={this.onFocusMessageSearch}
        theme={{classes}} />
    )
  }
}
