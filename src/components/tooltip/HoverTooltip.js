import React, {Component, PropTypes} from 'react'
import capitalize from 'lodash/string/capitalize'

import style from './HoverTooltipStyle'
import {useSheet} from 'grape-web/lib/jss'
import BlackTooltip from '../tooltip/BlackTooltip'
import * as styles from '../tooltip/themes/black'

@useSheet(style)
export default class Tooltip extends Component {
  static propTypes = {
    message: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    sheet: PropTypes.object.isRequired,
    align: PropTypes.string.isRequired,
    placement: PropTypes.string.isRequired,
    delay: PropTypes.number.isRequired,
    preventShow: PropTypes.bool.isRequired,
    arrowOffsetLeft: PropTypes.string
  }

  static defaultProps = {
    align: 'center',
    placement: 'bottom',
    delay: 500,
    preventShow: false
  }

  constructor() {
    super()
    this.state = {
      timeoutId: undefined,
      show: false
    }
  }

  componentWillReceiveProps({preventShow}) {
    if (preventShow && this.state.show) this.setState({show: false})
  }

  onMouseOver = () => {
    const timeoutId = setTimeout(() => {
      if (this.props.preventShow) return
      this.setState({show: true})
    }, this.props.delay)

    this.setState({timeoutId})
  }

  onMouseOut = () => {
    const {timeoutId} = this.state
    if (timeoutId) clearTimeout(timeoutId)

    this.setState({
      timeoutId: undefined,
      show: false
    })
  }

  render() {
    const {
      sheet: {classes},
      message, children, align,
      placement
    } = this.props

    if (!message) return null

    let arrowOffsetLeft = this.props.arrowOffsetLeft
    if (!arrowOffsetLeft) {
      switch (align) {
        case 'center':
          arrowOffsetLeft = '50%'
          break
        case 'left':
          arrowOffsetLeft = '15'
          break
        case 'right':
          arrowOffsetLeft = 'calc(100% - 15px)'
          break
        default:
      }
    }

    const position = styles[placement + capitalize(align)]
    return (
      <div className={classes.wrapper}>
        <span
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}>
          {children}
        </span>
        <div className={classes.tooltip}>
          {this.state.show &&
            <BlackTooltip
              style={position}
              arrowOffsetLeft={arrowOffsetLeft}
              placement={placement}>
              {message}
            </BlackTooltip>
          }
        </div>
      </div>
    )
  }
}
