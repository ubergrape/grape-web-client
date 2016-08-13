import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import {useSheet} from 'grape-web/lib/jss'
import shallowCompare from 'react-addons-shallow-compare'

import {styles} from './dateSeparatorTheme'

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

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
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
