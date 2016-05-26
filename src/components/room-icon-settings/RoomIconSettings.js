import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import Dropdown from '../dropdown/Dropdown'
import Icon from '../room-icon/RoomIcon'
import style from './style'
import IconSettings from './IconSettings'

@useSheet(style)
export default class RoomIconSetting extends Component {
  static propTypes = {
    channel: PropTypes.object.isRequired,
    sheet: PropTypes.object.isRequired
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

  render() {
    const {channel, sheet} = this.props
    const {show} = this.state

    const {classes} = sheet
    return (
      <div>
        <button
          onClick={this.onShowDropdown}
          className={classes['iconSettingsButton' + (show ? 'Active' : '')]}
          ref="icon">
          <Icon name={channel.icon} backgroundColor={channel.color} size={60} />
        </button>
        {
          show && (
            <Dropdown
              {...this.props}
              onOutsideClick={this.onClickOutsideDropdown}
              target={this.refs.icon}>
              <IconSettings {...this.props} theme={{classes}} />
            </Dropdown>
          )
        }
      </div>
    )
  }
}
