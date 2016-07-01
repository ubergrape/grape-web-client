import React, {PropTypes} from 'react'

export default function Switch(props) {
  const {off, on, status, disabled, onChange, theme} = props
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

Switch.defaultProps = {
  disabled: false
}

Switch.propTypes = {
  off: PropTypes.string.isRequired,
  on: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  status: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired
}
