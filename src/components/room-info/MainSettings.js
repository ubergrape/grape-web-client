import React, {Component, PropTypes} from 'react'

import {maxChannelNameLength} from '../../constants/app'
import EditableString from '../editable-string/EditableString'
import Dropdown from '../dropdown/Dropdown'
import AdditionalActions from './AdditionalActions'
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
      dropdownOpened: false
    }
  }

  onClick() {
    if (!this.state.dropdownOpened) {
      setTimeout(() => {
        this.setState({dropdownOpened: true})
      })
    }
  }

  onClickOutsideDropdown() {
    this.setState({dropdownOpened: false})
  }

  onDeleteClick(channel) {
    this.props.onShowRoomDeleteDialog(channel.id)
  }

  renderDropDown() {
    if (!this.state.dropdownOpened) return null
    const {
      channel,
      onPrivacyChange
    } = this.props
    return (
      <Dropdown
        container={this}
        theme={tooltipStyle}
        target={this.refs.settings}
        onOutsideClick={::this.onClickOutsideDropdown}>
          <AdditionalActions
            {...this.props}
            onDeleteClick={this.onDeleteClick.bind(this, channel)}
            onPrivacyChange={onPrivacyChange}
            privacy={channel.isPublic ? 'private' : 'public'} />
      </Dropdown>
    )
  }

  renderRoomAvatar() {
    // const {classes, channel} = this.props

  }

  render() {
    const {classes, renameRoom, channel, roomSettings} = this.props
    return (
      <div className={classes.mainSettings}>
        <div>
          {this.renderRoomAvatar()}
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
            onClick={::this.onClick}
            ref="settings" />
          {this.renderDropDown()}
        </div>
      </div>
    )
  }
}
