import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import capitalize from 'lodash/string/capitalize'
import injectSheet from 'grape-web/lib/jss'

import {pickHTMLProps} from 'pick-react-known-prop'
import listenOutsideClick from '../outside-click/listenOutsideClick'
import GrayTooltip from '../tooltip/GrayTooltip'
import style from './style'

const Tooltip = listenOutsideClick(GrayTooltip)

/**
 * This component renders input with error tooltip
 * if `error` props passed.
 * `error` is object with 2 properties:
 * * `message` is `string` to disaplay in Tooltip
 * * `level` is `string`: `error` or `warning`
 */
@injectSheet(style)
export default class Input extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
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

  componentDidMount() {
    if (this.props.focused) this.refs.input.focus()
  }

  componentDidUpdate(prevProps) {
    if (this.props.focused && !prevProps.focused) this.refs.input.focus()
  }

  onChange = e => {
    const {error, clearError, onChange} = this.props
    if (error) clearError()
    onChange(e)
  }

  onToolipOutsideClick = () => {
    this.props.clearError()
  }

  render() {
    const {error, theme, sheet} = this.props
    const {classes, arrowOffset, tooltipOffset, placement} = theme
    return (
      <span className={sheet.classes.wrapper}>
        <input
          {...pickHTMLProps(this.props)}
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
