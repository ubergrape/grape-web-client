import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import {styles} from './bubbleTheme'

@useSheet(styles)
export default class Bubble extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    hasArrow: PropTypes.bool.isRequired
  }

  static defaultProps = {
    className: '',
    theme: {
      classes: {
        bubble: '',
        content: ''
      }
    },
    hasArrow: true
  }

  render() {
    const {children, className, theme, hasArrow, sheet} = this.props
    const {classes} = sheet
    const bubbleClass = classes[hasArrow ? 'bubbleWithArrow' : 'bubble']
    return (
      <div className={`${bubbleClass} ${theme.classes.bubble} ${className}`}>
        <div className={`${classes.content} ${theme.classes.content}`}>{children}</div>
      </div>
    )
  }
}
