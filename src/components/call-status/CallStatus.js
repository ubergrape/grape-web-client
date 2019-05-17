import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import cn from 'classnames'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import { injectIntl } from 'react-intl'

import styles from './theme'

const secondsToHms = s => ({
  hours: ((s - (s % 3600)) / 3600) % 60,
  minutes: ((s - (s % 60)) / 60) % 60,
  seconds: s % 60,
})

class CallStatus extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    call: PropTypes.object.isRequired,
    timer: PropTypes.number.isRequired,
    show: PropTypes.bool.isRequired,
    updateCallStatusTimer: PropTypes.func.isRequired,
    closeCallStatus: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.props.updateCallStatusTimer()
    }, 1000)
  }

  componentWillUnmount() {
    window.clearInterval(this.timer)
  }

  onCancel = () => {
    const {
      closeCallStatus,
      call: { channelId },
    } = this.props

    closeCallStatus(channelId)
  }

  render() {
    const { show, classes, call, timer } = this.props
    const { authorAvatarUrl, authorDisplayName } = call

    if (!show) return null

    const { minutes, seconds } = secondsToHms(timer)

    return (
      <div className={classes.window}>
        <div className={classes.avatar}>
          <img
            className={classes.image}
            alt="Interlocutor avatar"
            src={authorAvatarUrl}
          />
          <div className={classes.iconWrapper}>
            <Icon name="camera" className={classes.cameraIcon} />
          </div>
        </div>
        <div className={classes.details}>
          <span className={classes.name}>{authorDisplayName}</span>
          <span className={classes.time}>
            {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10
              ? `0${seconds}`
              : seconds}
          </span>
        </div>
        <button
          onClick={this.onCancel}
          className={cn(classes.button, classes.cancel)}
        >
          <Icon className={classes.missedIcon} name="callMissed" />
        </button>
      </div>
    )
  }
}

export default injectSheet(styles)(injectIntl(CallStatus))
