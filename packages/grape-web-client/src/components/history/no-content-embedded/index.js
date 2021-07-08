import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import { FormattedMessage } from 'react-intl'

import styles from './styles'

const RoomContent = ({ classes, name }) => (
  <div className={classes.noContentEmbedded}>
    <div className={classes.wrapper}>
      <Icon className={classes.icon} name="conversationsDots" />
      <h2 className={classes.title}>
        <FormattedMessage
          id="embeddedWelcomeToGroup"
          defaultMessage="Welcome to {channelName}"
          values={{ channelName: name }}
        />
      </h2>
      <p className={classes.description}>
        <FormattedMessage
          id="stillQuietHere"
          defaultMessage="It is still quiet here. Start the conversation now by sending your first message!"
        />
      </p>
    </div>
  </div>
)

const PmContent = ({ classes, displayName }) => (
  <div className={classes.noContentEmbedded}>
    <div className={classes.wrapper}>
      <Icon className={classes.icon} name="conversationsDots" />
      <h2 className={classes.title}>
        <FormattedMessage
          id="embeddedWelcomeToPm"
          defaultMessage="Private conversation with {partner}"
          values={{ partner: displayName }}
        />
      </h2>
      <p className={classes.description}>
        <FormattedMessage
          id="stillQuietHere"
          defaultMessage="It is still quiet here. Start the conversation now by sending your first message!"
        />
      </p>
    </div>
  </div>
)

class NoContentEmbedded extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    channel: PropTypes.shape({
      type: PropTypes.oneOf(['pm', 'room']).isRequired,
      name: PropTypes.string,
      partner: PropTypes.shape({
        displayName: PropTypes.string,
      }),
    }).isRequired,
  }

  render() {
    const { channel, classes } = this.props

    if (channel.type === 'room') {
      return <RoomContent name={channel.name} classes={classes} />
    }

    return (
      <PmContent displayName={channel.partner.displayName} classes={classes} />
    )
  }
}

export default injectSheet(styles)(NoContentEmbedded)
