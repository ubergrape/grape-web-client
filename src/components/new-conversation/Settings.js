import React, {Component, PropTypes} from 'react'
import keyname from 'keyname'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

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

function onInputKeyDown(onCreate, {keyCode}) {
  if (keyname(keyCode) === 'enter') onCreate()
}

const messages = defineMessages({
  placeholder: {
    id: 'EnterGroupName',
    defaultMessage: 'Enter group name'
  },
  off: {
    id: 'Private',
    defaultMessage: 'Private'
  },
  on: {
    id: 'Public',
    defaultMessage: 'Public'
  }
})

function Settings(props) {
  const {
    icon, color, name, advanced, saving, error, roomNameFocused,
    intl, theme, isPublic, onChangeRoomName, onClickRoomName, onCreate,
    onBlurRoomName, onPrivacyChange, clearRoomCreateError
  } = props

  if (!advanced) return null

  const {formatMessage} = intl
  const {classes} = theme
  return (
    <div className={classes.settings}>
      <IconSettings
        {...props}
        channel={{icon, color, isPublic}} />

      <div className={classes.name}>
        <Input
          placeholder={formatMessage(messages.placeholder)}
          value={name}
          focused={roomNameFocused}
          error={getError(error)}
          disabled={saving}
          clearError={clearRoomCreateError}
          onKeyDown={onInputKeyDown.bind(null, onCreate)}
          onChange={onChangeRoomName}
          onClick={onClickRoomName}
          onBlur={onBlurRoomName} />
      </div>
      <div className={classes.privacy}>
        <Switch
          off={formatMessage(messages.off)}
          on={formatMessage(messages.on)}
          disabled={saving}
          onChange={onPrivacyChange}
          status={isPublic} />
      </div>
    </div>
  )
}

Settings.propTypes = {
  intl: intlShape.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  saving: PropTypes.bool.isRequired,
  advanced: PropTypes.bool.isRequired,
  isPublic: PropTypes.bool.isRequired,
  roomNameFocused: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired,
  error: PropTypes.string,
  onCreate: PropTypes.func.isRequired,
  clearRoomCreateError: PropTypes.func.isRequired,
  onClickRoomName: PropTypes.func.isRequired,
  onBlurRoomName: PropTypes.func.isRequired,
  onChangeRoomName: PropTypes.func.isRequired,
  onPrivacyChange: PropTypes.func.isRequired
}

export default injectIntl(Settings)
