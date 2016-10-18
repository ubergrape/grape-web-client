import React, {Component, PropTypes} from 'react'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import {maxChannelNameLength} from '../../constants/app'
import EditableText from '../editable-text/EditableText'
import RoomIconSettings from '../room-icon-settings/RoomIconSettings'
import AdditionalActionsDropdown from './AdditionalActionsDropdown'

const messages = defineMessages({
  placeholder: {
    id: 'enterGroupNameHere',
    defaultMessage: 'Enter group name here…'
  }
})

@injectIntl
export default class MainSettings extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    renameRoom: PropTypes.func.isRequired,
    onChangePrivacy: PropTypes.func.isRequired,
    onShowRoomDeleteDialog: PropTypes.func.isRequired,
    clearRoomRenameError: PropTypes.func.isRequired,
    onSetRoomColor: PropTypes.func.isRequired,
    onSetRoomIcon: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired,
    renameError: PropTypes.object.isRequired,
    allowEdit: PropTypes.bool
  }

  static defaultProps = {
    allowEdit: false
  }

  getError() {
    const {message} = this.props.renameError
    if (!message) return undefined
    return {
      level: 'error',
      message
    }
  }

  renderAdditionalActions() {
    if (!this.props.allowEdit) return null
    const {classes} = this.props
    return (
      <div className={classes.additionalActions}>
        <button className={classes.notificationsButton}></button>
        <AdditionalActionsDropdown
          {...this.props}
          container={this}
          theme={{classes}} />
      </div>
    )
  }

  renderRoomName() {
    const {
      classes,
      renameRoom,
      clearRoomRenameError,
      channel,
      allowEdit,
      intl: {formatMessage}
    } = this.props

    if (!allowEdit) return <p className={classes.roomName}>{channel.name}</p>
    return (
      <div className={classes.roomName}>
        <EditableText
          placeholder={formatMessage(messages.placeholder)}
          clearError={clearRoomRenameError}
          maxLength={maxChannelNameLength}
          onSave={renameRoom}
          value={channel.name}
          error={this.getError()} />
      </div>
    )
  }

  renderSettings() {
    const {
      allowEdit,
      classes
    } = this.props

    if (!allowEdit) return null
    return (
      <div className={classes.settingsWrapper}>
        <RoomIconSettings
          {...this.props}
          container={this} />
      </div>
    )
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.mainSettings}>
        {this.renderSettings()}
        {this.renderRoomName()}
        {this.renderAdditionalActions()}
      </div>
    )
  }
}
