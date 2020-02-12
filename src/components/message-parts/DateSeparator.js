import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { defineMessages, injectIntl } from 'react-intl'
import moment from 'moment'

import { styles } from './dateSeparatorTheme'

const messages = defineMessages({
  today: {
    id: 'dateSeparatorToday',
    description: 'Date separator used in history, search, mentions etc.',
    defaultMessage: 'Today, {date}',
  },
  yesterday: {
    id: 'dateSeparatorYesterday',
    description: 'Date separator used in history, search, mentions etc.',
    defaultMessage: 'Yesterday, {date}',
  },
})

function format({ date, intl: { formatDate, formatMessage } }) {
  const now = moment()
  const isToday = moment(date).isSame(now, 'day')

  const dateStr = formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })

  if (isToday) return formatMessage(messages.today, { date: dateStr })

  const isYesterday = moment(date).isSame(now.subtract(1, 'day'), 'day')

  if (isYesterday) return formatMessage(messages.yesterday, { date: dateStr })

  return dateStr
}

@injectSheet(styles)
@injectIntl
export default class DateSeparator extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    theme: PropTypes.object,
  }

  static defaultProps = {
    theme: {
      date: '',
    },
  }

  render() {
    const {
      theme,
      sheet: { classes },
    } = this.props

    return (
      <div className={classes.separator}>
        <span className={`${classes.date} ${theme.date}`}>
          {format(this.props)}
        </span>
      </div>
    )
  }
}
