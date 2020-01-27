import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import moment from 'moment'
import injectSheet from 'grape-web/lib/jss'
import { merge } from 'lodash'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import Tooltip from '../tooltip/Tooltip'
import useTheme from '../theme/useTheme'
import * as tooltipTheme from '../tooltip/themes/gray'

import { styles } from './timeTheme'

const ThemedTooltip = useTheme(
  Tooltip,
  merge({}, tooltipTheme, {
    styles: { tooltip: styles.tooltip },
    arrowOffsetLeft: 10,
  }),
)

function UserTime(props) {
  const {
    time,
    isOpened,
    theme: { classes },
  } = props

  return (
    <div className={classes.userTime}>
      <span className={isOpened ? classes.globeActive : classes.globe} />
      {isOpened && (
        <ThemedTooltip placement="bottom">
          <div className={classes.userTimeContainer}>
            <span className={classes.userTimeText}>
              <FormattedMessage id="localTime" defaultMessage="Local time" />
              {': '}
            </span>
            <span className={classes.userTimeTime}>
              {/* Moment.js is the only too who can properly handle utc offset. */}
              {moment(time)
                .utcOffset(time)
                .format('LT')}
            </span>
          </div>
        </ThemedTooltip>
      )}
    </div>
  )
}

UserTime.propTypes = {
  time: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  isOpened: PropTypes.bool.isRequired,
}

/**
 * Return true if the timezone of the current user equals the passed
 * one.
 *
 * @param {String} time
 * @return {Boolean}
 */
function isReadersTimezone(time) {
  if (!time) return true
  const readersOffset = Math.abs(new Date().getTimezoneOffset())
  const writersOffset = moment.parseZone(time).utcOffset()
  return readersOffset === writersOffset
}

class Time extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    userTime: PropTypes.string,
  }

  static defaultProps = {
    userTime: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      isWritersTimeOpened: false,
      isSameTimezone: isReadersTimezone(props.userTime),
    }
  }

  onMouseOver = () => {
    if (this.state.isWritersTimeOpened) return
    this.setState({ isWritersTimeOpened: true })
  }

  onMouseOut = () => {
    if (!this.state.isWritersTimeOpened) return
    this.setState({ isWritersTimeOpened: false })
  }

  render() {
    const {
      time,
      userTime,
      intl: { formatTime },
      sheet: { classes },
    } = this.props
    const { timeContainer, timeContainerHoverable } = classes
    const { isSameTimezone, isWritersTimeOpened } = this.state

    return (
      <div
        className={classes.time}
        onMouseOver={this.onMouseOver}
        onFocus={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onBlur={this.onMouseOut}
      >
        <span
          className={isSameTimezone ? timeContainer : timeContainerHoverable}
        >
          {formatTime(time)}
        </span>
        {!isSameTimezone && userTime && (
          <UserTime
            isOpened={isWritersTimeOpened}
            time={userTime}
            theme={{ classes }}
          />
        )}
      </div>
    )
  }
}

export default injectSheet(styles)(injectIntl(Time))
