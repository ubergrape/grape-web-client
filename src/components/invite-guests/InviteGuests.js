import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import isEmpty from 'lodash/isEmpty'
import { FormattedMessage, injectIntl } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'

import { styles } from './theme'

class InviteGuests extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    channel: PropTypes.object,
    conf: PropTypes.object,
  }

  static defaultProps = {
    channel: {},
    conf: {},
  }

  render() {
    const { classes, channel, conf } = this.props

    if (isEmpty(channel) || !channel.permissions.canInviteGuests) return null

    return (
      <div className={classes.linkWrapper}>
        <a
          href={`${conf.server.guestInviteUrl}?group_id=${channel.id}&next=/chat`}
          className={classes.link}
        >
          <FormattedMessage
            id="inviteGuest"
            defaultMessage="Invite a guest to this group"
          />
        </a>
      </div>
    )
  }
}

export default injectSheet(styles)(injectIntl(InviteGuests))
