import React, {Component, PropTypes} from 'react'

import {maxChannelNameLength} from '../../constants/app'
import EditableString from '../editable-string/EditableString'
import Dropdown from '../dropdown/Dropdown'
import * as tooltipStyle from '../tooltip/themes/gray'

export default class MainSettings extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    renameRoom: PropTypes.func.isRequired,
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
    return (
      <Dropdown
        container={this}
        theme={tooltipStyle}
        target={this.refs.settings}
        onClickOutside={::this.onClickOutsideDropdown}>
          sddddddsddddddsddddddsdddddd
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
        <div className={classes.menu}>
          <button
            className={classes.additionalSettingsButton}
            onClick={::this.onClick}
            ref="settings" />
          {this.renderDropDown()}
        </div>
      </article>
    )
  }
}
