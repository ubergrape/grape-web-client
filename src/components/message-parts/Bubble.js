import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import styles from './bubbleStyles'

@useSheet(styles)
export default class Bubble extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    theme: PropTypes.object,
    arrow: PropTypes.bool
  }

  static defaultProps = {
    className: '',
    theme: {
      bubble: '',
      content: ''
    },
    arrow: true
  }

  render() {
    const {children, className, theme, arrow, sheet} = this.props
    const {classes} = sheet
    const bubbleClass = classes[arrow ? 'bubbleWithArrow' : 'bubble']
    return (
      <div className={`${bubbleClass} ${theme.bubble} ${className}`}>
        <div className={`${classes.content} ${theme.content}`}>{children}</div>
      </div>
    )
  }
}
