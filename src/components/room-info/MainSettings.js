import React, {Component, PropTypes} from 'react'

import {maxChannelNameLength} from '../../constants/app'
import EditableText from '../editable-text/EditableText'
import Dropdown from '../dropdown/Dropdown'
import Icon from '../room-icon/RoomIcon'
import AdditionalActions from './AdditionalActions'
import * as tooltipStyle from '../tooltip/themes/gray'
import IconSettings from './IconSettings'

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

  constructor() {
    super()
    this.state = {
      showAdditionalActions: false,
      showIconSettings: false
    }
  }

  onShowDropdownClick(field, e) {
    if (!this.state[field]) {
      // We need to stop further event propagation because
      // in same time it is outside click for dropdown
      // we're going to show.
      e.stopPropagation()
      this.setState({[field]: true})
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
      onChangePrivacy
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
            onChangePrivacy={onChangePrivacy}
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
    if (!this.props.allowEdit) return null
    return (
      <div className={this.props.classes.settingsWrapper}>
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
