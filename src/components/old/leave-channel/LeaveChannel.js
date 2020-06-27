import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl,
} from 'react-intl'

import Dialog from '../dialog/Dialog'
import theme from './theme'

const messages = defineMessages({
  title: {
    id: 'leaveGroupDialogTitle',
    defaultMessage: 'Leave Private Group',
  },
})

class LeaveChannel extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    show: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    hideLeaveChannelDialog: PropTypes.func.isRequired,
    onLeaveChannel: PropTypes.func.isRequired,
  }

  onHide = () => {
    this.props.hideLeaveChannelDialog()
  }

  onLeaveChannel = () => {
    const { onLeaveChannel, channel } = this.props
    onLeaveChannel(channel.id)
  }

  render() {
    const {
      intl: { formatMessage },
      channel,
      classes,
      show,
    } = this.props

    if (!show) return null

    return (
      <Dialog
        title={formatMessage(messages.title)}
        show={show}
        width={451}
        onHide={this.onHide}
      >
        <div className={classes.content}>
          <div className={classes.text}>
            <FormattedMessage
              id="leaveGroupDialogMessage"
              defaultMessage="Are you sure you want to leave the private group {group}? You {wontAbleToRejoin} this group unless you get invited again."
              values={{
                group: <span className={classes.textBold}>{channel.name}</span>,
                wontAbleToRejoin: (
                  <span className={classes.textBold}>
                    <FormattedMessage
                      id="wontAbleToRejoin"
                      defaultMessage="won't be able to re-join"
                    />
                  </span>
                ),
              }}
            />
          </div>
          <div className={classes.actions}>
            <button onClick={this.onHide} className={classes.cancelButton}>
              <FormattedMessage
                id="leaveGroupDialogCancel"
                defaultMessage="Cancel"
              />
            </button>
            <button
              onClick={this.onLeaveChannel}
              className={classes.leaveButton}
            >
              <FormattedMessage
                id="leaveGroupDialogButton"
                defaultMessage="Leave private group"
              />
            </button>
          </div>
        </div>
      </Dialog>
    )
  }
}

export default injectSheet(theme)(injectIntl(LeaveChannel))
