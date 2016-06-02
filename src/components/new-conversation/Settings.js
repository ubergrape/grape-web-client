import React, {Component, PropTypes} from 'react'
import RoomIconSettings from '../room-icon-settings/RoomIconSettings'
import Switch from '../switch/BlueSwitch'
import Input from '../input/GrayInput'

class IconSettings extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired
  }

  render() {
    return (
      <div className={this.props.theme.classes.icon}>
        <RoomIconSettings
          {...this.props}
          container={this} />
      </div>
    )
  }
}

function getError(message) {
  if (!message) return undefined
  return {
    level: 'error',
    message
  }
}

export default function Settings(props) {
  const {
    icon, color, name, advanced, error, roomNameFocused, theme,
    isPublic, onChangeRoomName, onClickRoomName,
    onBlurRoomName, onPrivacyChange, clearRoomCreateError
  } = props

  // TODO: return `null` once upgraded to React 0.15.
  if (!advanced) return <noscript />

  const {classes} = theme
  return (
    <div className={classes.settings}>
      <IconSettings
        {...props}
        channel={{icon, color}} />

      <div className={classes.name}>
        <Input
          placeholder="Enter group name"
          value={name}
          focused={roomNameFocused}
          error={getError(error)}
          clearError={clearRoomCreateError}
          onChange={onChangeRoomName}
          onClick={onClickRoomName}
          onBlur={onBlurRoomName} />
      </div>
      <div className={classes.privacy}>
        <Switch
          off="Private"
          on="Public"
          onChange={onPrivacyChange}
          status={isPublic} />
      </div>
    </div>
  )
}

Settings.propTypes = {
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  advanced: PropTypes.bool.isRequired,
  isPublic: PropTypes.bool.isRequired,
  roomNameFocused: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired,
  error: PropTypes.string,
  clearRoomCreateError: PropTypes.func.isRequired,
  onClickRoomName: PropTypes.func.isRequired,
  onBlurRoomName: PropTypes.func.isRequired,
  onChangeRoomName: PropTypes.func.isRequired,
  onPrivacyChange: PropTypes.func.isRequired
}
