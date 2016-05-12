import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import styles from './authorStyles'

@useSheet(styles)
export default class Author extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    author: PropTypes.string
  }

  static defaultProps = {
    author: 'Deleted User'
  }

  render() {
    const {author, sheet} = this.props
    const {classes} = sheet
    return (
      <span className={classes.author}>{author}</span>
    )
  }
}
