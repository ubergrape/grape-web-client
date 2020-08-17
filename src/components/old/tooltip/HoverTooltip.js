import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { capitalize } from 'lodash'
import injectSheet from 'grape-web/lib/jss'

import { getArrowOffset } from './utils'
import * as theme from './hoverTooltipTheme'
import BlackTooltip from './BlackTooltip'

class HoverTooltip extends PureComponent {
  static propTypes = {
    message: PropTypes.node,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object.isRequired,
    align: PropTypes.oneOf(['left', 'right', 'center']),
    placement: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    delay: PropTypes.number,
    disabled: PropTypes.bool,
    arrowMargin: PropTypes.number,
  }

  static defaultProps = {
    align: 'center',
    placement: 'bottom',
    delay: 500,
    disabled: false,
    arrowMargin: theme.arrowMargin,
    message: null,
  }

  render() {
    const {
      classes,
      message,
      children,
      align,
      placement,
      arrowMargin,
    } = this.props

    if (!message) return null

    const position = theme[placement + capitalize(align)]

    return (
      <span className={classes.wrapper}>
        {children}
        <div className={classes.tooltip}>
          {!this.props.disabled && (
            <BlackTooltip
              style={position}
              placement={placement}
              {...getArrowOffset(placement, align, arrowMargin)}
            >
              {message}
            </BlackTooltip>
          )}
        </div>
      </span>
    )
  }
}

export default injectSheet(theme.styles)(HoverTooltip)
