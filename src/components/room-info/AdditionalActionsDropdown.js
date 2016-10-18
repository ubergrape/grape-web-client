import React, {Component, PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'

import Tooltip from '../tooltip/HoverTooltip'
import Dropdown from '../dropdown/Dropdown'
import AdditionalActions from './AdditionalActions'
import {settingsButtonSize} from './roomInfoTheme'

export default class AdditionalActionsDropdown extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    onShowRoomDeleteDialog: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      show: false
    }
  }

  onShowDropdown = e => {
    if (!this.state.show) {
      // We need to stop further event propagation because
      // in same time it is outside click for dropdown
      // we're going to show.
      e.stopPropagation()
      this.setState({show: true})
    }
  }

  onClickOutsideDropdown = () => {
    this.setState({show: false})
  }

  onChannelDeleteClick = () => {
    this.props.onShowRoomDeleteDialog(this.props.channel.id)
  }


  render() {
    const {show} = this.state
    const {theme, channel} = this.props

    const {classes} = theme
    return (
      <div>
        <Tooltip
          align="right"
          placement="top"
          arrowMargin={Math.round(settingsButtonSize / 2)}
          disabled={show}
          message={<FormattedMessage id="editGroup" defaultMessage="Edit Group" />}>
          <button
            className={classes.settingsButton}
            onClick={this.onShowDropdown}
            ref="settings" />
        </Tooltip>
        {show &&
          <Dropdown
            {...this.props}
            target={this.refs.settings}
            onOutsideClick={this.onClickOutsideDropdown}>
            <AdditionalActions
              {...this.props}
              onDeleteClick={this.onChannelDeleteClick}
              privacy={channel.isPublic ? 'private' : 'public'} />
          </Dropdown>
        }
      </div>
    )
  }
}
