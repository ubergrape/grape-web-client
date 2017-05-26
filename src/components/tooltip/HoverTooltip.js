import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import capitalize from 'lodash/string/capitalize'
import injectSheet from 'grape-web/lib/jss'

import {getArrowOffset} from './utils'
import * as theme from './hoverTooltipTheme'
import BlackTooltip from './BlackTooltip'

const initialState = {
  timeoutId: undefined,
  show: false
}

@injectSheet(theme.styles)
export default class HoverTooltip extends PureComponent {
  static propTypes = {
    message: PropTypes.node,
    children: PropTypes.node.isRequired,
    sheet: PropTypes.object.isRequired,
    align: PropTypes.oneOf(['left', 'right', 'center']),
    placement: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    inline: PropTypes.bool.isRequired,
    delay: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    arrowMargin: PropTypes.number.isRequired
  }

  static defaultProps = {
    align: 'center',
    placement: 'bottom',
    inline: false,
    delay: 500,
    disabled: false,
    arrowMargin: theme.arrowMargin,
    message: null
  }

  constructor() {
    super()
    this.state = initialState
  }

  componentWillReceiveProps({disabled}) {
    if (disabled && this.state.show) this.setState(initialState)
  }

  onMouseOver = () => {
    if (this.props.disabled) return
    const timeoutId = setTimeout(() => {
      if (this.props.disabled) return
      this.setState({show: true})
    }, this.props.delay)

    this.setState({timeoutId})
  }

  onMouseOut = () => {
    if (this.props.disabled) return

    const {timeoutId} = this.state
    if (timeoutId) clearTimeout(timeoutId)

    this.setState(initialState)
  }

  render() {
    const {
      sheet: {classes},
      message, children, align,
      placement, inline, arrowMargin
    } = this.props

    if (!message) return null

    const position = theme[placement + capitalize(align)]
    return (
      <div
        className={classes[`wrapper${inline ? 'Inline' : ''}`]}
      >
        <span
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
        >
          {children}
        </span>
        <div className={classes.tooltip}>
          {this.state.show &&
            <BlackTooltip
              style={position}
              placement={placement}
              {...getArrowOffset(placement, align, arrowMargin)}
            >
              {message}
            </BlackTooltip>
          }
        </div>
      </div>
    )
  }
}
