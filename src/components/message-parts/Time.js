import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import injectSheet from 'grape-web/lib/jss'
import merge from 'lodash/object/merge'
import {FormattedMessage} from 'react-intl'
import shallowCompare from 'react-addons-shallow-compare'

import Tooltip from '../tooltip/Tooltip'
import useTheme from '../theme/useTheme'
import * as tooltipTheme from '../tooltip/themes/gray'

import {styles} from './timeTheme'

const ThemedTooltip = useTheme(Tooltip, merge({}, tooltipTheme, {
  styles: {tooltip: styles.tooltip},
  arrowOffsetLeft: 10
}))

function UserTime(props) {
  const {userTime, format, theme, isOpened} = props
  const {classes} = theme

  const time = moment.utc(userTime).utcOffset(userTime).format(format)
  return (
    <div className={classes.userTime}>
      <span className={isOpened ? classes.globeActive : classes.globe}></span>
      {isOpened &&
        <ThemedTooltip placement="bottom">
          <div className={classes.userTimeContainer}>
            <span className={classes.userTimeText}>
              <FormattedMessage
                id="localTime"
                defaultMessage="Local time" />
              {': '}
            </span>
            <span className={classes.userTimeTime}>
              {time}
            </span>
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
  if (!time) return true
  const readersOffset = Math.abs(new Date().getTimezoneOffset())
  const writersOffset = moment.parseZone(time).utcOffset()
  return readersOffset === writersOffset
}

@injectSheet(styles)
export default class Time extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    format: PropTypes.string.isRequired,
    userTime: PropTypes.string
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
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onMouseOver = () => {
    if (this.state.isWritersTimeOpened) return
    this.setState({isWritersTimeOpened: true})
  }

  onMouseOut = () => {
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
        {!isSameTimezone && userTime &&
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
