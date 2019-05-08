import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import cn from 'classnames'
import { injectIntl, FormattedMessage } from 'react-intl'

import styles from './theme'

const incomingCallTimeout = 30

class IncomingCall extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    incoming: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    timer: PropTypes.number.isRequired,
    openTime: PropTypes.number.isRequired,
    updateCallTimer: PropTypes.func.isRequired,
    closeIncomingCall: PropTypes.func.isRequired,
    joinIncomingCall: PropTypes.func.isRequired,
    rejectIncomingCall: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.props.updateCallTimer()
    }, 1000)
  }

  componentDidUpdate() {
    const { timer, openTime, closeIncomingCall, show, incoming } = this.props
    if (show && timer >= openTime + incomingCallTimeout)
      closeIncomingCall(incoming.channelId)
  }

  componentWillUnmount() {
    window.clearInterval(this.timer)
  }

  onJoin = () => {
    const {
      joinIncomingCall,
      incoming: { channelId, authorId, url },
    } = this.props
    joinIncomingCall({ channelId, authorId, url })
  }

  onReject = () => {
    const {
      rejectIncomingCall,
      incoming: { channelId, authorId },
    } = this.props
    rejectIncomingCall(channelId, authorId)
  }

  render() {
    const { show, classes } = this.props

    if (!show) return null

    return (
      <div className={classes.wrapper}>
        <div className={classes.background} />
        <div className={classes.dialog}>
          <div className={classes.avatar}>
            <Icon className={classes.pulse} name="pulse" />
            <img
              className={classes.image}
              alt="Name Surname"
              src="https://staging.chatgrape.com/imgsrc/m/9a0ac15c50f04fab834d08e6ff32d5c2/200x200/"
            />
          </div>
          <div className={classes.name}>Name Surname</div>
          <div className={classes.incoming}>
            <FormattedMessage
              id="incomingCall"
              defaultMessage="Incoming Call"
            />
          </div>
          <div className={classes.buttons}>
            <button
              onClick={this.onReject}
              className={cn(classes.button, classes.reject)}
            >
              <Icon className={classes.missedIcon} name="callMissed" />
            </button>
            <button
              onClick={this.onJoin}
              className={cn(classes.button, classes.accept)}
            >
              <Icon className={classes.ongoingIcon} name="callOngoing" />
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(injectIntl(IncomingCall))
