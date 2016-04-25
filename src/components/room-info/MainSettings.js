import React, {Component, PropTypes} from 'react'

import {maxChannelNameLength} from '../../constants/app'
import EditableString from '../editable-string/EditableString'
import Dropdown from '../dropdown/Dropdown'
import AdditionalActions from './AdditionalActions'
import Icon from '../room-icon/RoomIcon'
import * as tooltipStyle from '../tooltip/themes/gray'

export default class MainSettings extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    renameRoom: PropTypes.func.isRequired,
    onPrivacyChange: PropTypes.func.isRequired,
    onShowRoomDeleteDialog: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired,
    roomSettings: PropTypes.object.isRequired
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
        <Icon name={channel.icon} color={channel.color} size="60" />
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
        ололо
      </Dropdown>
    )
  }

  render() {
    const {classes, renameRoom, channel, roomSettings} = this.props
    return (
      <div className={classes.mainSettings}>
        <div>
          {this.renderIcon()}
          {this.renderIconSettings()}
        </div>
        <div className={classes.roomName}>
          <EditableString
            placeholder="Enter group name here…"
            maxLength={maxChannelNameLength}
            onSave={renameRoom}
            value={channel.name}
            error={roomSettings.nameError}
            />
        </div>
        <div className={classes.additionalActions}>
          <button
            className={classes.additionalActionsButton}
            onClick={this.onShowDropdownClick.bind(this, 'showAdditionalActions')}
            ref="settings" />
          {this.renderAdditionalActions()}
        </div>
      </div>
    )
  }
}
