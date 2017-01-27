import React, {PureComponent, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import capitalize from 'lodash/string/capitalize'
import injectSheet from 'grape-web/lib/jss'
import listenOutsideClick from 'grape-web/lib/outside-click'
import {pickHTMLProps} from 'pick-react-known-prop'
import cn from 'classnames'

import GrayTooltip from '../tooltip/GrayTooltip'
import {styles} from './theme'

const Tooltip = listenOutsideClick(GrayTooltip)

/**
 * This component renders input or textarea with error/warning tooltip
 * if `error` prop passed.
 */
// TODO: move this component to grape-ui library
// https://github.com/ubergrape/chatgrape/issues/4384
@injectSheet(styles)
export default class Input extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    clearError: PropTypes.func.isRequired,
    focused: PropTypes.bool.isRequired,
    className: PropTypes.string,
    type: PropTypes.oneOf(['input', 'textarea']),
    error: PropTypes.shape({
      message: PropTypes.string.isRequired,
      level: PropTypes.oneOf(['error', 'warning'])
    })
  }

  static defaultProps = {
    placement: 'bottom',
    type: 'input',
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

  renderInput() {
    const {type, error, theme: {classes}, className} = this.props
    const props = {
      ...pickHTMLProps(this.props),
      onChange: this.onChange,
      ref: 'input',
      className: cn(classes['input' + (error ? capitalize(error.level) : '')], className)
    }
    switch (type) {
      case 'input':
        return <input {...props} />
      case 'textarea':
        return <textarea {...props} />
      default:
    }
  }

  render() {
    const {error, theme, sheet} = this.props
    const {classes, arrowOffset, tooltipOffset, placement} = theme
    return (
      <span className={sheet.classes.wrapper}>
        {this.renderInput()}
        {error &&
          <Tooltip
            style={{left: tooltipOffset}}
            arrowOffsetLeft={arrowOffset}
            onOutsideClick={this.onToolipOutsideClick}
            placement={placement}>
              <div className={cn(classes.content)}>
                <span className={cn(classes[`${error.level}Message`])}>
                  {error.message}
                </span>
              </div>
          </Tooltip>
        }
      </span>
    )
  }
}
