import React, {PropTypes} from 'react'

export default function Switch(props) {
  const {off, on, status, onChange, theme} = props
  const {classes} = theme
  return (
    <span
      onClick={onChange}
      className={`${classes.switch} ${classes['switch' + (status ? 'On' : 'Off')]}`}>
      <span className={classes.label}>{on}</span>
      <span className={classes.label}>{off}</span>
    </span>
  )
}

Switch.propTypes = {
  off: PropTypes.string.isRequired,
  on: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  status: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired
}
