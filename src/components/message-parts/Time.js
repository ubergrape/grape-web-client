import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import {useSheet} from 'grape-web/lib/jss'
import bindAll from 'lodash/function/bindAll'
import merge from 'lodash/object/merge'

import Tooltip from '../tooltip/Tooltip'
import useTheme from '../theme/useTheme'
import * as tooltipTheme from '../tooltip/themes/gray'

import styles from './timeStyles'

const ThemedTooltip = useTheme(Tooltip, merge({}, tooltipTheme, {
  styles: {tooltip: styles.tooltip},
  arrowOffsetLeft: 10
}))

function UserTime(props) {
  const {userTime, format, theme, isOpened} = props
  const {classes} = theme

  return (
    <div className={classes.userTime}>
      <span className={isOpened ? classes.globeActive : classes.globe}></span>
      {isOpened &&
        <ThemedTooltip placement="bottom">
          <div className={classes.userTimeContainer}>
            <span className={classes.userTimeText}>Local time: </span>
            <span className={classes.userTimeTime}>{moment(userTime).format(format)}</span>
          </div>
        </ThemedTooltip>
      }
    </div>
  )
}

UserTime.propTypes = {
  userTime: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  format: PropTypes.string.isRequired,
  isOpened: PropTypes.bool.isRequired
}

/**
 * Return true if the timezone of the current user equals the passed
 * one.
 *
 * @param {String} time
 * @return {Boolean}
 */
function isReadersTimezone(time) {
  const readersOffset = Math.abs(new Date().getTimezoneOffset())
  const writersOffset = moment.parseZone(time).utcOffset()
  return readersOffset === writersOffset
}

@useSheet(styles)
export default class Time extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    userTime: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired
  }

  static defaultProps = {
    format: 'h:mm a'
  }

  constructor(props) {
    super(props)
    this.state = {
      isWritersTimeOpened: false,
      isSameTimezone: isReadersTimezone(props.userTime)
    }
    bindAll(this, 'onMouseOver', 'onMouseOut')
  }

  onMouseOver() {
    if (this.state.isWritersTimeOpened) return
    this.setState({isWritersTimeOpened: true})
  }

  onMouseOut() {
    if (!this.state.isWritersTimeOpened) return
    this.setState({isWritersTimeOpened: false})
  }

  render() {
    const {time, userTime, format, sheet} = this.props
    const {isSameTimezone, isWritersTimeOpened} = this.state
    const {classes} = sheet

    return (
      <div
        className={classes.time}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}>
        <span className={isSameTimezone ? classes.timeContainer : classes.timeContainerHoverable}>
          {moment(time).format(format)}
        </span>
        {!isSameTimezone &&
          <UserTime
            isOpened={isWritersTimeOpened}
            userTime={userTime}
            format={format}
            theme={{classes}} />
        }
      </div>
    )
  }
}
