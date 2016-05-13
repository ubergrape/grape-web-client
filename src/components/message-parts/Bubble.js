import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import styles from './bubbleStyles'

@useSheet(styles)
export default class Bubble extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    arrow: PropTypes.bool.isRequired
  }

  static defaultProps = {
    className: '',
    theme: {
      classes: {
        bubble: '',
        content: ''
      }
    },
    arrow: true
  }

  render() {
    const {children, className, theme, arrow, sheet} = this.props
    const {classes} = sheet
    const bubbleClass = classes[arrow ? 'bubbleWithArrow' : 'bubble']
    return (
      <div className={`${bubbleClass} ${theme.classes.bubble} ${className}`}>
        <div className={`${classes.content} ${theme.classes.content}`}>{children}</div>
      </div>
    )
  }
}
