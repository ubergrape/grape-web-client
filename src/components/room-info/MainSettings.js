import React, {Component, PropTypes} from 'react'

import {maxChannelNameLength} from '../../constants/app'
import EditableString from '../editable-string/EditableString'
import Dropdown from '../dropdown/Dropdown'
import Icon from '../room-icon/RoomIcon'
import AdditionalActions from './AdditionalActions'
import * as tooltipStyle from '../tooltip/themes/gray'
import IconSettings from './IconSettings'

export default class MainSettings extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    renameRoom: PropTypes.func.isRequired,
    onPrivacyChange: PropTypes.func.isRequired,
    onShowRoomDeleteDialog: PropTypes.func.isRequired,
    onSetRoomColor: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired,
    roomSettings: PropTypes.object.isRequired,
    allowEdit: PropTypes.bool
  }

  static defaultProps = {
    allowEdit: false
  }

  constructor() {
    super()
    this.state = {
      showAdditionalActions: false,
      showIconSettings: false
    }
  }

  onShowDropdownClick(field) {
    if (!this.state[field]) {
      setTimeout(() => {
        this.setState({[field]: true})
      })
    }
  }

  onClickOutsideDropdown(field) {
    this.setState({[field]: false})
  }

  onChannelDeleteClick() {
    this.props.onShowRoomDeleteDialog(this.props.channel.id)
  }

  renderAdditionalActions() {
    if (!this.props.allowEdit) return null
    const {classes} = this.props
    return (
      <div className={classes.additionalActions}>
        <button
          className={classes.additionalActionsButton}
          onClick={this.onShowDropdownClick.bind(this, 'showAdditionalActions')}
          ref="settings" />
        {this.renderAdditionalActionsDropdown()}
      </div>
    )
  }

  renderAdditionalActionsDropdown() {
    if (!this.state.showAdditionalActions) return null
    const {
      channel,
      onPrivacyChange
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
            onPrivacyChange={onPrivacyChange}
            privacy={channel.isPublic ? 'private' : 'public'} />
      </Dropdown>
    )
  }

  renderIcon() {
    const {channel, classes} = this.props
    const buttonClassName = 'iconSettingsButton' + (this.state.showIconSettings ? 'Active' : '')
    return (
      <button
        onClick={this.onShowDropdownClick.bind(this, 'showIconSettings')}
        className={classes[buttonClassName]}
        ref="icon">
        <Icon name={channel.icon} backgroundColor={channel.color} size="60" />
      </button>
    )
  }

  renderIconSettings() {
    if (!this.state.showIconSettings) return null
    return (
      <Dropdown
        container={this}
        theme={tooltipStyle}
        target={this.refs.icon}
        onOutsideClick={this.onClickOutsideDropdown.bind(this, 'showIconSettings')}>
        <IconSettings {...this.props} />
      </Dropdown>
    )
  }

  renderRoomName() {
    const {
      classes,
      renameRoom,
      channel,
      roomSettings,
      allowEdit
    } = this.props

    if (!allowEdit) return <p className={classes.roomName}>{channel.name}</p>

    return (
      <div className={classes.roomName}>
        <EditableString
          placeholder="Enter group name here…"
          maxLength={maxChannelNameLength}
          onSave={renameRoom}
          value={channel.name}
          error={roomSettings.nameError}
          />
      </div>
    )
  }

  renderSettings() {
    if (!this.props.allowEdit) return null
    return (
      <div>
        {this.renderIcon()}
        {this.renderIconSettings()}
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
