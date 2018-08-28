import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'

import { styles } from './bubbleTheme'

class Bubble extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    theme: PropTypes.object.isRequired,
    hasArrow: PropTypes.bool.isRequired,
    style: PropTypes.object,
  }

  static defaultProps = {
    className: '',
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
      >
        <div className={`${classes.content} ${theme.classes.content}`}>
          {children}
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(Bubble)
