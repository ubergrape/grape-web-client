import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import cn from 'classnames'
import { injectIntl, FormattedMessage } from 'react-intl'

import isChromeOrFirefox from '../../../utils/is-chrome-or-firefox'
import styles from './theme'

class IncomingCall extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    incoming: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    joinIncomingCall: PropTypes.func.isRequired,
    rejectIncomingCall: PropTypes.func.isRequired,
    replyWithMessage: PropTypes.func.isRequired,
  }

  onJoin = () => {
    const {
      joinIncomingCall,
      incoming: { channelId, callId },
    } = this.props
    joinIncomingCall({ channelId, callId })
  }

  onReject = () => {
    const {
      rejectIncomingCall,
      incoming: { channelId, callId },
    } = this.props
    rejectIncomingCall({ channelId, callId })
  }

  replyWithMessage = () => {
    const {
      replyWithMessage,
      incoming: { channelId, callId },
    } = this.props
    replyWithMessage({ channelId, callId })
  }

  render() {
    const { show, classes, incoming } = this.props
    const {
      message,
      authorAvatarUrl,
      authorDisplayName,
      grapecallUrl,
      callId,
    } = incoming

    if (!show) return null

    return (
      <div className={classes.wrapper}>
        <div className={classes.background} />
        <div className={classes.dialog}>
          <div className={classes.avatar}>
            <Icon className={classes.pulse} name="pulse" />
            <img
              className={classes.image}
              alt="Caller avatar"
              src={authorAvatarUrl}
            />
          </div>
          <div className={classes.name}>{authorDisplayName}</div>
          <div className={classes.description}>{message}</div>
          {!isChromeOrFirefox ? (
            <div>
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
                    defaultMessage="Please use our {desktopApp} instaed instead ({download}, if you haven’t installed it yet). Alternatively you can use Grape with {browsers} to enjoy the full experience."
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
          ) : (
            <div className={classes.buttons}>
              <button
                onClick={this.onReject}
                className={cn(classes.button, classes.reject)}
              >
                <Icon className={classes.missedIcon} name="callMissed" />
              </button>
              <a
                href={`${grapecallUrl}?call_id=${callId}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={this.onJoin}
                className={cn(classes.button, classes.accept)}
              >
                <Icon className={classes.ongoingIcon} name="callOngoing" />
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(injectIntl(IncomingCall))
