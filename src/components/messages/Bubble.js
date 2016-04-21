import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import styles from './bubbleStyles'

@useSheet(styles)
export default class Bubble extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    children: PropTypes.node,
    className: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  render() {
    const {children, className, sheet} = this.props
    const {classes} = sheet
    return (
      <div className={`${classes.bubble} ${className}`}>
        <div className={classes.content}>{children}</div>
      </div>
    )
  }
}
