import React, {Component, PropTypes} from 'react'

import {maxChannelNameLength} from '../../constants/app'
import EditableText from '../editable-text/EditableText'
import RoomIconSettings from '../room-icon-settings/RoomIconSettings'
import Dropdown from '../dropdown/Dropdown'
import Icon from '../room-icon/RoomIcon'
import AdditionalActions from './AdditionalActions'
import AdditionalActionsDropdown from './AdditionalActionsDropdown'
import * as tooltipStyle from '../tooltip/themes/gray'

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

  renderAdditionalActionsDropdown() {
    if (!this.state.showAdditionalActions) return null
    const {
      channel
    } = this.props
    return (
      <Dropdown
        container={this}
        theme={tooltipStyle}
        target={this.refs.settings}
        onOutsideClick={this.onClickOutsideDropdown.bind(this, 'showAdditionalActions')}>
          <AdditionalActions
            {...this.props}
            onDeleteClick={::this.onChannelDeleteClick}
            privacy={channel.isPublic ? 'private' : 'public'} />
      </Dropdown>
    )
  }

  renderIcon() {
    const {channel, classes} = this.props
    const buttonName = 'iconSettingsButton' + (this.state.showIconSettings ? 'Active' : '')
    return (
      <button
        onClick={this.onShowDropdownClick.bind(this, 'showIconSettings')}
        className={classes[buttonName]}
        ref="icon">
        <Icon name={channel.icon} backgroundColor={channel.color} size={60} />
      </button>
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
