import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import styles from './headerStyles'
import Author from './Author'
import LocalDate from './LocalDate'

@useSheet(styles)
export default class Header extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    date: PropTypes.instanceOf(Date),
    author: PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  render() {
    const {date, author, className, sheet} = this.props
    const {classes} = sheet
    return (
      <header className={`${classes.header} ${className}`}>
        <Author author={author} />
        <LocalDate date={date} />
      </header>
    )
  }
}
