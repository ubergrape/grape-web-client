import React, {Component, PropTypes} from 'react'

import {maxChannelNameLength} from '../../constants/app'
import EditableText from '../editable-text/EditableText'
import RoomIconSettings from '../room-icon-settings/RoomIconSettings'
import AdditionalActionsDropdown from './AdditionalActionsDropdown'

export default class MainSettings extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    renameRoom: PropTypes.func.isRequired,
    onChangePrivacy: PropTypes.func.isRequired,
    onShowRoomDeleteDialog: PropTypes.func.isRequired,
    onSetRoomColor: PropTypes.func.isRequired,
    onSetRoomIcon: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired,
    renameError: PropTypes.object,
    allowEdit: PropTypes.bool
  }

  static defaultProps = {
    allowEdit: false
  }

  renderAdditionalActions() {
    if (!this.props.allowEdit) return null
    const {classes} = this.props
    return (
      <div className={classes.additionalActions}>
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
      channel,
      renameError,
      allowEdit
    } = this.props

    if (!allowEdit) return <p className={classes.roomName}>{channel.name}</p>
    return (
      <div className={classes.roomName}>
        <EditableText
          placeholder="Enter group name here…"
          maxLength={maxChannelNameLength}
          onSave={renameRoom}
          value={channel.name}
          error={renameError.message}
          />
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
