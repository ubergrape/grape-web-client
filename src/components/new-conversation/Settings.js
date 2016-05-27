import React, {Component, PropTypes} from 'react'
import RoomIconSettings from '../room-icon-settings/RoomIconSettings'
import Switch from '../switch/BlueSwitch'

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

export default function Settings(props) {
  const {
    icon, color, name, showRoomSettings, theme,
    isPublic, onChangeRoomName, onClickRoomName,
    onBlurRoomName, onPrivacyChange
  } = props

  // TODO: return `null` once upgraded to React 0.15.
  if (!showRoomSettings) return <noscript />

  const {classes} = theme
  return (
    <div className={classes.settings}>
      <IconSettings
        {...props}
        channel={{icon, color}} />

      <div className={classes.name}>
        <input
          placeholder="Enter group name"
          value={name}
          onChange={onChangeRoomName}
          onClick={onClickRoomName}
          onBlur={onBlurRoomName}
          className={classes.nameInput}/>
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
  showRoomSettings: PropTypes.bool.isRequired,
  isPublic: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired,
  onClickRoomName: PropTypes.func.isRequired,
  onBlurRoomName: PropTypes.func.isRequired,
  onChangeRoomName: PropTypes.func.isRequired,
  onPrivacyChange: PropTypes.func.isRequired
}
