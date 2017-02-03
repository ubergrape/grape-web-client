import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import colors from 'grape-theme/dist/base-colors'

import Dropdown from '../dropdown/Dropdown'
import Icon from '../room-icon/RoomIcon'
import {styles, iconSize} from './theme'
import IconSettings from './IconSettings'

const iconTheme = {
  size: iconSize,
  statusSize: 23,
  statusBorderWidth: 2,
  statusBorderColor: colors.grayBlueLighter
}

@injectSheet(styles)
export default class RoomIconSetting extends PureComponent {
  static propTypes = {
    channel: PropTypes.object.isRequired,
    sheet: PropTypes.object.isRequired,
    dropdownPlacement: PropTypes.string.isRequired
  }

  static defaultProps = {
    dropdownPlacement: 'bottom'
  }

  constructor() {
    super()
    this.state = {
      show: false
    }
  }

  onShowDropdown = (e) => {
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

  onRefButton = (ref) => {
    this.button = ref
  }

  render() {
    const {channel, sheet, dropdownPlacement} = this.props
    const {show} = this.state

    const {icon, color: backgroundColor, isPublic} = channel
    const {classes} = sheet

    return (
      <div>
        <button
          onClick={this.onShowDropdown}
          className={classes[`iconSettingsButton${show ? 'Active' : ''}`]}
          ref={this.onRefButton}
        >
          <Icon
            name={icon}
            isPrivate={!isPublic}
            theme={{...iconTheme, backgroundColor}}
            showPrivateStatus
          />
        </button>
        {show &&
          <Dropdown
            {...this.props}
            placement={dropdownPlacement}
            onOutsideClick={this.onClickOutsideDropdown}
            target={this.button}
          >
            <IconSettings {...this.props} theme={{classes}} />
          </Dropdown>
        }
      </div>
    )
  }
}
