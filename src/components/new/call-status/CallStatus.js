import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { capitalize } from 'lodash'
import Draggable from 'react-draggable'
import cn from 'classnames'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import { injectIntl } from 'react-intl'
import { defaultIconSlug } from '../../../constants/channel'

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
    updateCallStatusTimer: PropTypes.func.isRequired,
    closeCallStatus: PropTypes.func.isRequired,
  }

  componentDidUpdate(prevProps) {
    const {
      updateCallStatusTimer,
      callStatus: { show },
    } = this.props

    if (show && prevProps.callStatus.show !== show) {
      this.timer = setInterval(() => {
        updateCallStatusTimer()
      }, 1000)
    }

    if (!show && prevProps.callStatus.show !== show) {
      window.clearInterval(this.timer)
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.timer)
  }

  onCancel = () => {
    const {
      closeCallStatus,
      callStatus: { data },
    } = this.props
    const {
      channel: { id: channelId },
      call: { id: callId },
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
