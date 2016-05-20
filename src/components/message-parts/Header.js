import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import {styles} from './headerTheme'
import Author from './Author'
import Time from './Time'

@useSheet(styles)
export default class Header extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date),
    userTime: PropTypes.string,
    author: PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  render() {
    const {time, userTime, author, className, sheet} = this.props
    const {classes} = sheet
    return (
      <header className={`${classes.header} ${className}`}>
        <Author author={author} />
        <Time time={time} userTime={userTime} />
      </header>
    )
  }
}
