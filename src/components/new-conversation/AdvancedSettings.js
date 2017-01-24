import React, {PureComponent, PropTypes} from 'react'
import keyname from 'keyname'
import injectSheet from 'grape-web/lib/jss'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import RoomIconSettings from '../room-icon-settings/RoomIconSettings'
import Switch from '../switch/BlueSwitch'
import Input from '../input/GrayInputBigger'
import {styles} from './advancedSettingsTheme'

class IconSettings extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  render() {
    return (
      <div className={this.props.classes.icon}>
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

const messages = defineMessages({
  placeholder: {
    id: 'enterGroupName',
    defaultMessage: 'Enter group name'
  },
  off: {
    id: 'private',
    defaultMessage: 'Private'
  },
  on: {
    id: 'public',
    defaultMessage: 'Public'
  }
})

@injectSheet(styles)
@injectIntl
export default class AdvancedSettings extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    icon: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    saving: PropTypes.bool.isRequired,
    isPublic: PropTypes.bool.isRequired,
    sheet: PropTypes.object.isRequired,
    isNameFocused: PropTypes.bool,
    error: PropTypes.string,
    onCreate: PropTypes.func.isRequired,
    clearRoomCreateError: PropTypes.func.isRequired,
    onChangeRoomName: PropTypes.func.isRequired,
    onPrivacyChange: PropTypes.func.isRequired,
    onClickRoomName: PropTypes.func.isRequired
  }

  onChangeRoomName = ({target}) => {
    this.props.onChangeRoomName({name: target.value})
  }

  onInputKeyDown = ({keyCode}) => {
    if (keyname(keyCode) === 'enter') this.props.onCreate()
  }

  render() {
    const {
      icon, color, name, saving, error,
      intl: {formatMessage}, sheet: {classes}, isPublic,
      onPrivacyChange, clearRoomCreateError, isNameFocused, onClickRoomName
    } = this.props

    return (
      <div className={classes.advancedSettings}>
        <IconSettings
          {...this.props}
          classes={classes}
          channel={{icon, color, isPublic}} />
        <div className={classes.name}>
          <Input
            placeholder={formatMessage(messages.placeholder)}
            value={name}
            error={getError(error)}
            disabled={saving}
            focused={isNameFocused}
            clearError={clearRoomCreateError}
            onKeyDown={this.onInputKeyDown}
            onChange={this.onChangeRoomName}
            onClick={onClickRoomName} />
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
}
