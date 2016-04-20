import React, {Component, PropTypes} from 'react'
import moment from 'moment-timezone'
import {useSheet} from 'grape-web/lib/jss'

import styles from './styles'

@useSheet(styles)
export default class DateSeparator extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    date: PropTypes.instanceOf(Date),
    format: PropTypes.string,
    theme: PropTypes.object
  }

  static defaultProps = {
    date: new Date(),
    format: 'MMM Do, YYYY',
    theme: {
      date: ''
    }
  }

  render() {
    const {theme, date, format} = this.props
    const {classes} = this.props.sheet

    return (
      <div className={classes.separator}>
        <span className={`${classes.date} ${theme.date}`} >
          {moment(date).format(format)}
        </span>
      </div>
    )
  }
}
