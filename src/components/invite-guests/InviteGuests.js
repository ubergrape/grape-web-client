import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/noop'

import { styles } from './theme'

class InviteGuests extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    channel: PropTypes.object,
    conf: PropTypes.object,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    onClick: noop,
    channel: {},
    conf: {},
  }

  onClick = () => {
    const { onClick, channel, conf } = this.props
    onClick(`${conf.server.guestInviteUrl}?group_id=${channel.id}&next=/chat`)
  }

  render() {
    const { classes, channel } = this.props

    if (!channel.permissions.canInviteGuests) return null

    return (
      <div className={classes.linkWrapper}>
        <button className={classes.link} onClick={this.onClick}>
          <FormattedMessage
            id="inviteGuest"
            defaultMessage="Invite a guest to this group"
          />
        </button>
      </div>
    )
  }
}

export default injectSheet(styles)(injectIntl(InviteGuests))
