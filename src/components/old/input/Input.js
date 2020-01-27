import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { capitalize, noop } from 'lodash'
import injectSheet from 'grape-web/lib/jss'
import listenOutsideClick from 'grape-web/lib/components/outside-click'
import { pickHTMLProps } from 'pick-react-known-prop'
import cn from 'classnames'

import GrayTooltip from '../tooltip/GrayTooltip'

const Tooltip = listenOutsideClick(GrayTooltip)

/**
 * This component renders input or textarea with error/warning tooltip
 * if `error` prop passed.
 */
// TODO: move this component to grape-ui library
// https://github.com/ubergrape/chatgrape/issues/4384
class Input extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    clearError: PropTypes.func,
    focused: PropTypes.bool,
    className: PropTypes.string,
    type: PropTypes.oneOf(['input', 'textarea']),
    error: PropTypes.shape({
      message: PropTypes.string.isRequired,
      level: PropTypes.oneOf(['error', 'warning']),
    }),
  }

  static defaultProps = {
    type: 'input',
    className: null,
    error: null,
    onChange: noop,
    clearError: noop,
    focused: false,
  }

  componentDidMount() {
    if (this.props.focused) this.input.focus()
  }

  componentDidUpdate(prevProps) {
    if (this.props.focused && !prevProps.focused) this.input.focus()
  }

  onChange = e => {
    const { error, clearError, onChange } = this.props
    if (error) clearError()
    onChange(e)
  }

  onToolipOutsideClick = () => {
    this.props.clearError()
  }

  onRefInput = ref => {
    this.input = ref
  }

  renderInput() {
    const {
      type,
      error,
      theme: { classes },
      className,
    } = this.props
    const props = {
      ...pickHTMLProps(this.props),
      onChange: this.onChange,
      ref: this.onRefInput,
      className: cn(
        classes[`input${error ? capitalize(error.level) : ''}`],
        className,
      ),
    }
    switch (type) {
      case 'input':
        return <input {...props} />
      case 'textarea':
        return <textarea {...props} />
      default:
    }

    return null
  }

  render() {
    const { error, theme, sheet } = this.props
    const {
      classes,
      arrowOffset,
      tooltipOffsetLeft,
      tooltipOffsetTop,
      placement,
    } = theme
    return (
      <div className={sheet.classes.input}>
        {this.renderInput()}
        {error && (
          <Tooltip
            style={{ left: tooltipOffsetLeft, top: tooltipOffsetTop }}
            arrowOffsetLeft={arrowOffset}
            onOutsideClick={this.onToolipOutsideClick}
            placement={placement}
          >
            <div className={cn(classes.content)}>
              <span className={cn(classes[`${error.level}Message`])}>
                {error.message}
              </span>
            </div>
          </Tooltip>
        )}
      </div>
    )
  }
}

export default injectSheet({
  input: {
    isolate: false,
    position: 'relative',
  },
})(Input)
