import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'
import shallowCompare from 'react-addons-shallow-compare'

import {styles} from './headerTheme'
import Author from './Author'
import Time from './Time'

@useSheet(styles)
export default class Header extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date),
    onClickAuthor: PropTypes.func.isRequired,
    userTime: PropTypes.string,
    author: PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    className: '',
    onClickAuthor: noop
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {
      time, userTime, author, onClickAuthor,
      className, sheet
    } = this.props
    const {classes} = sheet
    return (
      <header className={`${classes.header} ${className}`}>
        <Author onClick={onClickAuthor} author={author} />
        <Time time={time} userTime={userTime} />
      </header>
    )
  }
}
