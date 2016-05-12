import React, {Component, PropTypes} from 'react'
import moment from 'moment-timezone'
import {useSheet} from 'grape-web/lib/jss'

import styles from './localDateStyles'

@useSheet(styles)
export default class LocalDate extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    date: PropTypes.instanceOf(Date),
    dateFormat: PropTypes.string
  }

  static defaultProps = {
    dateFormat: 'h:mm a'
  }

  render() {
    const {date, dateFormat, sheet} = this.props
    const {classes} = sheet
    return (
      <span className={classes.localDate}>{moment(date).format(dateFormat)}</span>
    )
  }
}
