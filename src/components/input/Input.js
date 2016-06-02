import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import capitalize from 'lodash/string/capitalize'

import listenOutsideClick from '../outside-click/listenOutsideClick'
import GrayTooltip from '../tooltip/GrayTooltip'

const Tooltip = listenOutsideClick(GrayTooltip)

export default class Input extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    clearError: PropTypes.func.isRequired,
    focused: PropTypes.bool.isRequired,
    error: PropTypes.shape({
      message: React.PropTypes.string.isRequired,
      level: React.PropTypes.string.isRequired
    })
  }

  static defaultProps = {
    placement: 'bottom',
    focused: false,
    onChange: noop,
    clearError: noop
  }

  componentDidUpdate(prevProps) {
    if (this.props.focused && !prevProps.focused) this.refs.input.focus()
  }

  onChange = e => {
    this.props.clearError()
    this.props.onChange(e)
  }

  onToolipOutsideClick = () => {
    this.props.clearError()
  }

  render() {
    const {error, theme} = this.props
    const {classes, arrowOffset, tooltipOffset, placement} = theme
    return (
      <span className={classes.wrapper}>
        <input
          {...this.props}
          onChange={this.onChange}
          ref="input"
          className={classes['input' + (error ? capitalize(error.level) : '')]}/>
        {error &&
          <Tooltip
            style={{left: tooltipOffset}}
            arrowOffsetLeft={arrowOffset}
            onOutsideClick={this.onToolipOutsideClick}
            placement={placement}>
              <div className={classes.content}>
                <span className={classes[`${error.level}Message`]}>
                  {error.message}
                </span>
              </div>
          </Tooltip>
        }
      </span>
    )
  }
}
