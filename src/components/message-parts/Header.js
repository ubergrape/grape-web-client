import React, {Component, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import shallowCompare from 'react-addons-shallow-compare'

import {styles} from './headerTheme'
import Author from './Author'
import Time from './Time'

@injectSheet(styles)
export default class Header extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date),
    onClickAuthor: PropTypes.func,
    userTime: PropTypes.string,
    author: PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    className: '',
    theme: {
      classes: {
        header: ''
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render() {
    const {
      time, userTime, author, onClickAuthor,
      className, sheet, theme
    } = this.props
    const {classes} = sheet
    return (
      <header className={`${classes.header} ${theme.classes.header} ${className}`}>
        <Author
          onClick={onClickAuthor}
          author={author}
          className={theme.classes[onClickAuthor ? 'authorClickable' : 'author']} />
        <Time time={time} userTime={userTime} />
      </header>
    )
  }
}
