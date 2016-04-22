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
    onRoomDelete: PropTypes.func.isRequired,
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

  renderDropDown() {
    if (!this.state.dropdownOpened) return null
    const {
      channel,
      onPrivacyChange,
      onRoomDelete
    } = this.props
    return (
      <Dropdown
        container={this}
        theme={tooltipStyle}
        target={this.refs.settings}
        onOutsideClick={::this.onClickOutsideDropdown}>
          <AdditionalActions
            {...this.props}
            onDelete={onRoomDelete}
            onPrivacyChange={onPrivacyChange}
            privacy={channel.isPublic ? 'private' : 'public'} />
      </Dropdown>
    )
  }

  render() {
    const {classes, renameRoom, channel, roomSettings} = this.props
    return (
      <article className={classes.mainSettings}>
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
      </article>
    )
  }
}
