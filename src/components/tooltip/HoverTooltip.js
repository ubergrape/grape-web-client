import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import capitalize from 'lodash/string/capitalize'
import injectSheet from 'grape-web/lib/jss'

import { getArrowOffset } from './utils'
import * as theme from './hoverTooltipTheme'
import BlackTooltip from './BlackTooltip'

const initialState = {
  timeoutId: undefined,
  show: false,
}

@injectSheet(theme.styles)
export default class HoverTooltip extends PureComponent {
  static propTypes = {
    message: PropTypes.node,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object.isRequired,
    align: PropTypes.oneOf(['left', 'right', 'center']),
    placement: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    inline: PropTypes.bool,
    delay: PropTypes.number,
    disabled: PropTypes.bool,
    arrowMargin: PropTypes.number,
  }

  static defaultProps = {
    align: 'center',
    placement: 'bottom',
    inline: false,
    delay: 500,
    disabled: false,
    arrowMargin: theme.arrowMargin,
    message: null,
  }

  state = initialState

  componentWillReceiveProps({ disabled }) {
    if (disabled && this.state.show) this.setState(initialState)
  }

  onMouseEnter = () => {
    if (this.props.disabled) return
    const timeoutId = setTimeout(() => {
      if (this.props.disabled) return
      this.setState({ show: true })
    }, this.props.delay)

    this.setState({ timeoutId })
  }

  onMouseLeave = () => {
    if (this.props.disabled) return

    const { timeoutId } = this.state
    if (timeoutId) clearTimeout(timeoutId)

    this.setState(initialState)
  }

  render() {
    const {
      classes,
      message,
      children,
      align,
      placement,
      inline,
      arrowMargin,
    } = this.props

    if (!message) return null

    const position = theme[placement + capitalize(align)]

    return (
      <div className={classes[`wrapper${inline ? 'Inline' : ''}`]}>
        <span
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          className={classes.childrenWrapper}
        >
          {children}
        </span>
        <div className={classes.tooltip}>
          {this.state.show && (
            <BlackTooltip
              style={position}
              placement={placement}
              {...getArrowOffset(placement, align, arrowMargin)}
            >
              {message}
            </BlackTooltip>
          )}
        </div>
      </div>
    )
  }
}
