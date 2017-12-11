import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import colors from 'grape-theme/dist/base-colors'

import Dropdown from '../dropdown/Dropdown'
import Icon from '../room-icon/RoomIcon'
import {styles} from './theme'
import {iconSize} from './constants'
import IconSettings from './IconSettings'

const iconTheme = {
  size: iconSize,
  statusSize: 23,
  statusBorderWidth: 2,
  statusBorderColor: colors.grayBlueLighter
}

@injectSheet(styles)
export default class RoomIconSettings extends PureComponent {
  static propTypes = {
    channel: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    dropdownPlacement: PropTypes.string.isRequired,
    container: PropTypes.object.isRequired
  }

  static defaultProps = {
    dropdownPlacement: 'bottom'
  }

  state = {show: false}

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
    const {
      channel: {icon, color: backgroundColor, isPublic},
      classes,
      dropdownPlacement,
      container
    } = this.props
    const {show} = this.state

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
            container={container}
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
