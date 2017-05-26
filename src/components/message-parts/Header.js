import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './headerTheme'
import Author from './Author'
import Time from './Time'

@injectSheet(styles)
export default class Header extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date),
    onClickAuthor: PropTypes.func,
    userTime: PropTypes.string,
    author: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node
  }

  static defaultProps = {
    className: '',
    theme: {
      classes: {
        header: ''
      }
    },
    children: null,
    onClickAuthor: null,
    time: null,
    userTime: null,
    author: null
  }

  render() {
    const {
      time, userTime, author, onClickAuthor,
      className, sheet, theme, children
    } = this.props
    const {classes} = sheet
    return (
      <header className={`${classes.header} ${theme.classes.header} ${className}`}>
        <Author
          onClick={onClickAuthor}
          author={author}
          className={theme.classes[onClickAuthor ? 'authorClickable' : 'author']}
        />
        <Time time={time} userTime={userTime} />
        {children}
      </header>
    )
  }
}
