import React, {PureComponent, PropTypes} from 'react'
import {injectIntl} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './theme'
import Items from './Items'

@injectSheet(styles)
@injectIntl
export default class Header extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    mate: PropTypes.object.isRequired,
    favorite: PropTypes.object.isRequired,
    showInSidebar: PropTypes.func.isRequired,
    updateMessageSearchQuery: PropTypes.func.isRequired
  }

  onFocusMessageSearch = ({target}) => {
    this.props.showInSidebar('search')
    this.props.updateMessageSearchQuery(target.value)
  }

  onChangeMessageSearch = ({target}) => {
    this.props.updateMessageSearchQuery(target.value)
  }

  render() {
    const {sheet: {classes}, ...rest} = this.props
    return (
      <Items
        {...rest}
        onChangeMessageSearch={this.onChangeMessageSearch}
        onFocusMessageSearch={this.onFocusMessageSearch}
        theme={{classes}}
      />
    )
  }
}
