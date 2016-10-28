import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'

export default class Switch extends Component {
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

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
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
