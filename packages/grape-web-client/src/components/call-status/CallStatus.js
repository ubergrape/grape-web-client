import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import capitalize from 'lodash/capitalize'
import Draggable from 'react-draggable'
import cn from 'classnames'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import { injectIntl } from 'react-intl'

import { defaultIconSlug } from '../../constants/channel'
import animationInterval from '../../utils/animation-interval'
import theme from './theme'

const secondsToHms = s => ({
  hours: ((s - (s % 3600)) / 3600) % 60,
  minutes: ((s - (s % 60)) / 60) % 60,
  seconds: s % 60,
})

class CallStatus extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    callStatus: PropTypes.object.isRequired,
    call: PropTypes.object.isRequired,
    updateCallStatusTimer: PropTypes.func.isRequired,
    closeCallStatus: PropTypes.func.isRequired,
  }

  componentDidUpdate(prevProps) {
    const {
      updateCallStatusTimer,
      callStatus: { show },
    } = this.props

    if (show && prevProps.callStatus.show !== show) {
      this.controller = new AbortController()
      animationInterval(1000, this.controller.signal, (time, start) => {
        updateCallStatusTimer(
          parseInt(time / 1000, 10) - parseInt(start / 1000, 10),
        )
      })
    }

    if (!show && prevProps.callStatus.show !== show) {
      if (this.controller) this.controller.abort()
    }
  }

  componentWillUnmount() {
    if (this.controller) this.controller.abort()
  }

  onCancel = () => {
    const {
      closeCallStatus,
      call: { id: callId },
      callStatus: { data },
    } = this.props
    const {
      channel: { id: channelId },
    } = data

    closeCallStatus({ channelId, callId })
  }

  render() {
    const {
      classes,
      callStatus: { data, timer, show },
    } = this.props

    if (!show) return null

    const { channel, author } = data
    const { hours, minutes, seconds } = secondsToHms(timer)

    return (
      <div className={classes.windowWrapper}>
        <Draggable bounds="parent">
          <div className={classes.window}>
            <div className={classes.avatar}>
              {channel.type === 'pm' ? (
                <img
                  className={classes.image}
                  alt="Interlocutor avatar"
                  src={author.avatar}
                />
              ) : (
                <div className={classes.channelIconWrapper}>
                  <Icon
                    name={`room${capitalize(channel.icon || defaultIconSlug)}`}
                    className={classes.channelIcon}
                  />
                </div>
              )}
              <div className={classes.cameraIconWrapper}>
                <Icon name="camera" className={classes.cameraIcon} />
              </div>
            </div>
            <div className={classes.details}>
              <span className={classes.name}>
                {channel.type === 'pm' ? author.displayName : channel.name}
              </span>
              <span className={classes.time}>
                {hours < 10 ? `0${hours}` : hours}:
                {minutes < 10 ? `0${minutes}` : minutes}:
                {seconds < 10 ? `0${seconds}` : seconds}
              </span>
            </div>
            <button
              onClick={this.onCancel}
              className={cn(classes.button, classes.cancel)}
            >
              <Icon className={classes.missedIcon} name="callMissed" />
            </button>
          </div>
        </Draggable>
      </div>
    )
  }
}

export default injectSheet(theme)(injectIntl(CallStatus))
