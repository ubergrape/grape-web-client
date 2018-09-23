import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'

import { styles } from './bubbleTheme'

@injectSheet(styles)
export default class Bubble extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    theme: PropTypes.object,
    hasArrow: PropTypes.bool,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    style: PropTypes.object,
  }

  static defaultProps = {
    className: '',
    theme: {
      classes: {
        bubble: '',
        content: '',
      },
    },
    hasArrow: true,
    style: null,
  }

  render() {
    const { children, className, theme, hasArrow, sheet, style } = this.props
    const { classes } = sheet
    const bubbleClass = classes[hasArrow ? 'bubbleWithArrow' : 'bubble']
    return (
      <div
        className={`${bubbleClass} ${theme.classes.bubble} ${className}`}
        style={style}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
      >
        <div className={`${classes.content} ${theme.classes.content}`}>
          {children}
        </div>
      </div>
    )
  }
}
