import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import Author from './Author'
import Time from './Time'

@injectSheet({
  header: {
    display: 'flex',
    overflow: 'hidden',
    width: '100%',
    alignItems: 'baseline',
  },
})
export default class Header extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.string.isRequired,
    theme: PropTypes.object,
    onClickAuthor: PropTypes.func,
    userTime: PropTypes.string,
    author: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
  }

  static defaultProps = {
    className: '',
    theme: {
      classes: {
        header: '',
      },
    },
    children: null,
    onClickAuthor: null,
    userTime: null,
    author: null,
  }

  render() {
    const {
      time,
      userTime,
      author,
      onClickAuthor,
      className,
      sheet,
      theme,
      children,
    } = this.props
    const { classes } = sheet
    return (
      <header
        className={cn(classes.header, theme && theme.classes.header, className)}
      >
        <Author
          onClick={onClickAuthor}
          author={author}
          className={
            theme.classes[onClickAuthor ? 'authorClickable' : 'author']
          }
        />
        <Time time={time} userTime={userTime} />
        {children}
      </header>
    )
  }
}
