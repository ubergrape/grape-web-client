import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import keyname from 'keyname'
import injectSheet from 'grape-web/lib/jss'
import { defineMessages, intlShape, injectIntl } from 'react-intl'

import Switch from '../switch/BlueSwitch'
import Input from '../input/GrayInputBigger'
import IconSettings from './IconSettings'

function getError(message) {
  if (!message) return undefined
  return {
    level: 'error',
    message,
  }
}

const messages = defineMessages({
  placeholder: {
    id: 'enterGroupName',
    defaultMessage: 'Enter group name',
  },
  off: {
    id: 'private',
    defaultMessage: 'Private',
  },
  on: {
    id: 'public',
    defaultMessage: 'Public',
  },
})

@injectSheet({
  advancedSettings: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
  },
  icon: {
    flexShrink: 1,
  },
  name: {
    flexGrow: 1,
    marginRight: 10,
  },
})
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
    colors: PropTypes.object.isRequired,
    isNameFocused: PropTypes.bool,
    error: PropTypes.string,
    onCreate: PropTypes.func.isRequired,
    clearRoomCreateError: PropTypes.func.isRequired,
    onChangeRoomName: PropTypes.func.isRequired,
    onPrivacyChange: PropTypes.func.isRequired,
    onClickRoomName: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isNameFocused: false,
    error: null,
  }

  onChangeRoomName = ({ target }) => {
    this.props.onChangeRoomName({ name: target.value })
  }

  onInputKeyDown = ({ keyCode }) => {
    if (keyname(keyCode) === 'enter') this.props.onCreate()
  }

  render() {
    const {
      icon,
      color,
      name,
      saving,
      error,
      colors,
      intl: { formatMessage },
      sheet: { classes },
      isPublic,
      onPrivacyChange,
      clearRoomCreateError,
      isNameFocused,
      onClickRoomName,
      ...iconSettingsProps
    } = this.props

    return (
      <div className={classes.advancedSettings}>
        <IconSettings
          {...iconSettingsProps}
          classes={classes}
          colors={colors}
          channel={{ icon, color, isPublic }}
        />
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
            onClick={onClickRoomName}
          />
        </div>
        <div>
          <Switch
            off={formatMessage(messages.off)}
            on={formatMessage(messages.on)}
            disabled={saving}
            colors={colors}
            onChange={onPrivacyChange}
            status={isPublic}
          />
        </div>
      </div>
    )
  }
}
