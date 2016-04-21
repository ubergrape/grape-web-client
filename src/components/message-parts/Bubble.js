import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import styles from './bubbleStyles'

@useSheet(styles)
export default class Bubble extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    theme: PropTypes.object
  }

  static defaultProps = {
    className: '',
    theme: {
      bubble: '',
      content: ''
    }
  }

  render() {
    const {children, className, theme, sheet} = this.props
    const {classes} = sheet
    return (
      <div className={`${classes.bubble} ${theme.bubble} ${className}`}>
        <div className={`${classes.content} ${theme.content}`}>{children}</div>
      </div>
    )
  }
}
