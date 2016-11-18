import React, {PureComponent, PropTypes} from 'react'

export default class Switch extends PureComponent {
  static propTypes = {
    off: PropTypes.string.isRequired,
    on: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    status: PropTypes.bool.isRequired,
    theme: PropTypes.object.isRequired
  }

  static defaultProps = {
    disabled: false
  }

  render() {
    const {off, on, status, disabled, onChange, theme} = this.props
    const {classes} = theme
    let switchClass = `${classes.switch} ${classes['switch' + (status ? 'On' : 'Off')]}`
    if (disabled) switchClass += ` ${classes.switchDisabled}`

    return (
      <span
        onClick={onChange}
        className={switchClass}>
        <span className={classes.label}>{on}</span>
        <span className={classes.label}>{off}</span>
      </span>
    )
  }
}
