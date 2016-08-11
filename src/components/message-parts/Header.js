import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'

import {styles} from './headerTheme'
import Author from './Author'
import Time from './Time'

@useSheet(styles)
export default class Header extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date),
    onClickUserName: PropTypes.func.isRequired,
    userTime: PropTypes.string,
    author: PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    className: '',
    onClickUserName: noop
  }

  render() {
    const {
      time, userTime, author, onClickUserName,
      className, sheet
    } = this.props
    const {classes} = sheet
    return (
      <header className={`${classes.header} ${className}`}>
        <Author onClick={onClickUserName} author={author} />
        <Time time={time} userTime={userTime} />
      </header>
    )
  }
}
