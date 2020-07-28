import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import isEmpty from 'lodash/isEmpty'

import getButtonProps from './getButtonProps'

import Tooltip from '../../tooltip/HoverTooltip'

import styles from './styles'
import messages from './messages'

class VideoConferenceButton extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    call: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    showVideoConferenceWarning: PropTypes.func.isRequired,
    showToastNotification: PropTypes.func.isRequired,
  }

  showVideoConferenceWarning = () => {
    this.props.showVideoConferenceWarning()
  }

  showOnAnotherCallToast = () => {
    const {
      intl: { formatMessage },
      showToastNotification,
    } = this.props

    showToastNotification(formatMessage(messages.oneCall))
  }

  showOnCallToast = () => {
    const {
      intl: { formatMessage },
      channel,
      showToastNotification,
    } = this.props

    showToastNotification(
      formatMessage(messages.userInAnotherCall, {
        name: channel.partner.displayName,
      }),
    )
  }

  render() {
    const { channel, call, classes, user } = this.props

    if (isEmpty(channel)) return null

    const buttonProps = getButtonProps({ user, channel, call })

    if (buttonProps.type === 'button') {
      return (
        <Tooltip message={buttonProps.message}>
          <button
            onClick={this[buttonProps.onClick]}
            className={classes.button}
          >
            <Icon
              name={buttonProps.icon}
              className={classes[buttonProps.className]}
            />
          </button>
        </Tooltip>
      )
    }

    if (buttonProps.type === 'link') {
      return (
        <Tooltip message={buttonProps.message}>
          <a
            href={buttonProps.link}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.button}
          >
            <Icon
              name={buttonProps.icon}
              className={classes[buttonProps.className]}
            />
          </a>
        </Tooltip>
      )
    }

    return null
  }
}

export default injectSheet(styles)(VideoConferenceButton)
