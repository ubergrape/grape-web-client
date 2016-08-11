import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import shallowCompare from 'react-addons-shallow-compare'

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
    className: PropTypes.string,
    onAuthorClick: PropTypes.func
  }

  static defaultProps = {
    className: ''
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {time, userTime, author, className, sheet, onAuthorClick} = this.props
    const {classes} = sheet
    return (
      <header className={`${classes.header} ${className}`}>
        <Author author={author} onClick={onAuthorClick} />
        <Time time={time} userTime={userTime} />
      </header>
    )
  }
}
