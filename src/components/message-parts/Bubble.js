import React, {Component, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import shallowCompare from 'react-addons-shallow-compare'

import {styles} from './bubbleTheme'

@injectSheet(styles)
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

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
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
