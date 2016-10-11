import React, {Component, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import shallowCompare from 'react-addons-shallow-compare'
import {FormattedDate, FormattedMessage} from 'react-intl'
import moment from 'moment'

import {styles} from './dateSeparatorTheme'

function DateWithDay({date}) {
  const dateEl = (
    <FormattedDate
      value={date}
      year="numeric"
      month="short"
      day="2-digit" />
  )

  const today = moment()
  const isToday = moment(date).isSame(today, 'day')

  if (isToday) {
    return (
      <FormattedMessage
        id="dateSeparatorToday"
        description="Date separator used in history, search, mentions etc."
        defaultMessage="Today, {date}"
        values={{date: dateEl}} />
    )
  }

  const isYesterday = moment(date).isSame(today.subtract(1, 'day'), 'day')

  if (isYesterday) {
    return (
      <FormattedMessage
        id="dateSeparatorYesterday"
        description="Date separator used in history, search, mentions etc."
        defaultMessage="Yesterday, {date}"
        values={{date: dateEl}} />
    )
  }

  return dateEl
}

DateWithDay.propTypes = {
  date: PropTypes.instanceOf(Date)
}

@injectSheet(styles)
export default class DateSeparator extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    date: PropTypes.instanceOf(Date),
    theme: PropTypes.object
  }

  static defaultProps = {
    date: new Date(),
    theme: {
      date: ''
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {theme, date, sheet: {classes}} = this.props

    return (
      <div className={classes.separator}>
        <span className={`${classes.date} ${theme.date}`}>
          <DateWithDay date={date} />
        </span>
      </div>
    )
  }
}
