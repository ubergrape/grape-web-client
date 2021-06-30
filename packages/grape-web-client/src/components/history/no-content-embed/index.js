import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'
import { FormattedMessage } from 'react-intl'

import styles from './styles'

class NoContentEmbed extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    channel: PropTypes.shape({
      type: PropTypes.oneOf(['pm', 'room']).isRequired,
      name: PropTypes.string,
      isPublic: PropTypes.bool,
      partner: PropTypes.shape({}),
    }).isRequired,
  }

  render() {
    const { channel, classes } = this.props

    if (channel.type === 'room') {
      return (
        <div className={classes.wrapper}>
          <h2 className={classes.title}>
            <FormattedMessage
              id="embedWelcomeTo"
              defaultMessage="Welcome to {channelName}"
              values={{ channelName: channel.name }}
            />
          </h2>
          <p className={classes.description}>
            <FormattedMessage
              id="stillQuietHere"
              defaultMessage="It is still quiet here. Start the conversation now by sending your first message!"
            />
          </p>
        </div>
      )
    }

    return null
  }
}

export default injectSheet(styles)(NoContentEmbed)
