import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import {injectIntl} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './theme'
import Items from './Items'

@injectSheet(styles)
@injectIntl
export default class Header extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    channel: PropTypes.object.isRequired,
    mate: PropTypes.object.isRequired,
    favorite: PropTypes.object.isRequired,
    support: PropTypes.object.isRequired,
    sidebar: PropTypes.oneOfType([
      PropTypes.string,
      React.PropTypes.bool
    ]),
    mentions: PropTypes.number,
    showChannelMembersInvite: PropTypes.func,
    updateMessageSearchQuery: PropTypes.func,
    hideIntercom: PropTypes.func,
    showInSidebar: PropTypes.func,
    hideSidebar: PropTypes.func
  }

  componentWillReceiveProps(nextProps) {
    // Hide intercom, because it keeps state outside of app.
    const {support: {type}, hideIntercom} = nextProps
    if (type !== this.props.support.type && type === 'intercom') hideIntercom()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
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
      <div className={classes.headerWrapper}>
        <Items
          {...this.props}
          onChangeMessageSearch={this.onChangeMessageSearch}
          onFocusMessageSearch={this.onFocusMessageSearch}
          theme={{classes}} />
      </div>
    )
  }
}
