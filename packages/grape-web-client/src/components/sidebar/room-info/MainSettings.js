import PropTypes from 'prop-types'
import cn from 'classnames'
import React, { PureComponent } from 'react'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl,
} from 'react-intl'

import { maxChannelNameLength } from '../../../constants/app'
import {
  isAllOff,
  isAllInherit,
  values as notificationSettingsValues,
} from '../../../utils/notification-settings'
import EditableText from '../../editable-text/EditableText'
import { RoomIconSettings } from '../../room-icon-settings'
import Tooltip from '../../tooltip/HoverTooltip'
import AdditionalActionsDropdown from './AdditionalActionsDropdown'
import { settingsButtonSize } from './constants'

const messages = defineMessages({
  placeholder: {
    id: 'enterGroupNameHere',
    defaultMessage: 'Enter group name here…',
  },
})

const NotificationSettingsButton = ({ classes, settings, onShow }) => {
  let state = 'Custom'
  if (isAllOff(settings)) state = 'Off'
  if (isAllInherit(settings)) state = 'Inherit'

  return (
    <Tooltip
      align="right"
      placement="top"
      arrowMargin={Math.round(settingsButtonSize / 2)}
      message={
        <FormattedMessage
          id="notificationSettingsTooltip"
          defaultMessage="Edit notification settings"
        />
      }
    >
      <button
        className={cn(
          classes.notificationsButton,
          classes[`notificationsButton${state}`],
        )}
        onClick={onShow}
      />
    </Tooltip>
  )
}

NotificationSettingsButton.propTypes = {
  onShow: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    desktop: PropTypes.oneOf(notificationSettingsValues),
    push: PropTypes.oneOf(notificationSettingsValues),
  }).isRequired,
  classes: PropTypes.object.isRequired,
}

@injectIntl
export default class MainSettings extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    colors: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    renameRoom: PropTypes.func.isRequired,
    showNotificationSettings: PropTypes.func.isRequired,
    clearRoomRenameError: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired,
    renameError: PropTypes.object.isRequired,
    notificationSettings: PropTypes.object.isRequired,
    allowEdit: PropTypes.bool,
    allowDelete: PropTypes.bool,
  }

  static defaultProps = {
    allowEdit: false,
    allowDelete: false,
  }

  onShowNotificationSettings = () => {
    const { showNotificationSettings, channel } = this.props
    showNotificationSettings({ channel })
  }

  getError() {
    const { message } = this.props.renameError
    if (!message) return undefined
    return {
      level: 'error',
      message,
    }
  }

  renderAdditionalActions() {
    const { allowEdit, classes, channel, notificationSettings } = this.props

    return (
      <div className={classes.additionalActions}>
        <NotificationSettingsButton
          channel={channel}
          classes={classes}
          onShow={this.onShowNotificationSettings}
          settings={notificationSettings}
        />
        {allowEdit && (
          <AdditionalActionsDropdown
            {...this.props}
            container={this}
            classes={classes}
          />
        )}
      </div>
    )
  }

  renderRoomName() {
    const {
      classes,
      colors,
      intl: { formatMessage },
      renameRoom,
      clearRoomRenameError,
      channel,
      allowEdit,
    } = this.props

    if (!allowEdit) return <p className={classes.groupName}>{channel.name}</p>

    return (
      <div className={classes.groupName}>
        <EditableText
          placeholder={formatMessage(messages.placeholder)}
          clearError={clearRoomRenameError}
          maxLength={maxChannelNameLength}
          onSave={renameRoom}
          value={channel.name}
          colors={colors}
          error={this.getError()}
        />
      </div>
    )
  }

  renderSettings() {
    const { classes } = this.props

    return (
      <div className={classes.settingsWrapper}>
        <RoomIconSettings {...this.props} container={this} />
      </div>
    )
  }

  render() {
    const { classes } = this.props
    return (
      <section className={classes.mainSettings}>
        {this.renderSettings()}
        {this.renderRoomName()}
        {this.renderAdditionalActions()}
      </section>
    )
  }
}
