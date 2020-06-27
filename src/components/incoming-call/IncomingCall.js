import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import isEmpty from 'lodash/isEmpty'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import cn from 'classnames'
import {
  defineMessages,
  intlShape,
  injectIntl,
  FormattedMessage,
} from 'react-intl'

import isChromeOrFirefox from '../../utils/is-chrome-or-firefox'
import styles from './theme'

const messages = defineMessages({
  groupDescription: {
    id: 'groupIncomingDescription',
    defaultMessage: '{name} invited you to the group call',
    description: 'Group call incoming screen description',
  },
})

class IncomingCall extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    data: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    rejectIncomingCall: PropTypes.func.isRequired,
    closeIncomingCall: PropTypes.func.isRequired,
    replyWithMessage: PropTypes.func.isRequired,
    endSound: PropTypes.func.isRequired,
  }

  onReject = () => {
    const {
      rejectIncomingCall,
      data: {
        channel: { id: channelId },
        call: { id: callId },
      },
    } = this.props
    rejectIncomingCall({ channelId, callId })
  }

  replyWithMessage = () => {
    const {
      replyWithMessage,
      data: {
        channel: { id: channelId },
        call: { id: callId },
      },
    } = this.props
    replyWithMessage({ channelId, callId })
  }

  closeIncomingCall = () => {
    const { closeIncomingCall, endSound } = this.props
    closeIncomingCall()
    endSound()
  }

  render() {
    const {
      show,
      classes,
      data,
      intl: { formatMessage },
    } = this.props
    const { channel, message, author, grapecallUrl, call } = data

    if (!show || isEmpty(data)) return null

    return (
      <div className={classes.wrapper}>
        <div className={classes.background} />
        <div className={classes.dialog}>
          <div className={classes.avatar}>
            <Icon className={classes.pulse} name="pulse" />
            <img
              className={classes.image}
              alt="Caller avatar"
              src={author.avatar}
            />
          </div>
          <div className={classes.name}>
            {channel.type === 'room' ? channel.name : author.displayName}
          </div>
          {isChromeOrFirefox ? (
            <div>
              <div
                className={cn(classes.description, classes.descriptionSmall)}
              >
                {channel.type === 'room'
                  ? formatMessage(messages.groupDescription, {
                      name: author.displayName,
                    })
                  : message}
              </div>
              <div className={classes.buttons}>
                <button
                  onClick={this.onReject}
                  className={cn(classes.button, classes.reject)}
                >
                  <Icon className={classes.missedIcon} name="callMissed" />
                </button>
                <a
                  href={`${grapecallUrl}?call_id=${call.id}`}
                  onClick={this.closeIncomingCall}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(classes.button, classes.accept)}
                >
                  <Icon className={classes.ongoingIcon} name="callOngoing" />
                </a>
              </div>
            </div>
          ) : (
            <div>
              <div
                className={cn(classes.description, classes.descriptionLarge)}
              >
                {channel.type === 'room'
                  ? formatMessage(messages.groupDescription, {
                      name: author.displayName,
                    })
                  : message}
              </div>
              <span className={classes.unsupported}>
                <FormattedMessage
                  id="unsuportedBrowserIncomingCall"
                  defaultMessage="Sorry, video conferencing isn’t supported in this browser"
                />
              </span>
              <div className={classes.singleButtons}>
                <button
                  onClick={this.replyWithMessage}
                  className={classes.replyButton}
                >
                  <FormattedMessage
                    id="replyWithMessage"
                    defaultMessage="Reply with a message"
                  />
                </button>
              </div>
              <div className={classes.furtherSteps}>
                <p>
                  <FormattedMessage
                    id="unsupportedBrowserShort"
                    defaultMessage="Unfortunately, the browser you are using at the moment doesn’t support video conferencing with Grape Call."
                  />
                </p>
                <p>
                  <FormattedMessage
                    id="pleaseUseDesktopApp"
                    defaultMessage="Please use our {desktopApp} instead ({download}, if you haven’t installed it yet). Alternatively you can use Grape with {browsers} to enjoy the full experience."
                    values={{
                      desktopApp: (
                        <span className={cn(classes.text, classes.bold)}>
                          <FormattedMessage
                            id="desktopApp"
                            defaultMessage="desktop app"
                          />
                        </span>
                      ),
                      browsers: (
                        <span className={cn(classes.text, classes.bold)}>
                          <FormattedMessage
                            id="chromeOrFirefox"
                            defaultMessage="Chrome or Firefox"
                          />
                        </span>
                      ),
                      download: (
                        <a
                          href="https://github.com/ubergrape/grape-electron/releases/latest"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            classes.text,
                            classes.blueLink,
                            classes.bold,
                          )}
                        >
                          <FormattedMessage
                            id="download"
                            defaultMessage="download"
                          />
                        </a>
                      ),
                    }}
                  />
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(injectIntl(IncomingCall))
