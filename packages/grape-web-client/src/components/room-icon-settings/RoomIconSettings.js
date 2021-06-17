import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import colors from 'grape-theme/dist/base-colors'

import Dropdown from '../dropdown/Dropdown'
import Icon from '../room-icon/RoomIcon'
import { styles } from './theme'
import { iconSize } from './constants'
import IconSettings from './IconSettings'

const iconTheme = {
  size: iconSize,
  statusSize: 23,
  statusBorderWidth: 2,
  statusBorderColor: colors.grayBlueLighter,
}

@injectSheet(styles)
export default class RoomIconSettings extends PureComponent {
  static propTypes = {
    channel: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    allowEdit: PropTypes.bool,
    dropdownPlacement: PropTypes.string,
    container: PropTypes.object.isRequired,
  }

  static defaultProps = {
    allowEdit: false,
    dropdownPlacement: 'bottom',
  }

  state = { show: false }

  onShowDropdown = e => {
    if (!this.state.show && this.props.allowEdit) {
      // We need to stop further event propagation because
      // in same time it is outside click for dropdown
      // we're going to show.
      e.stopPropagation()
      this.setState({ show: true })
    }
  }

  onClickOutsideDropdown = () => {
    this.setState({ show: false })
  }

  onRefButton = ref => {
    this.button = ref
  }

  render() {
    const {
      channel: { icon, color: backgroundColor, isPublic },
      classes,
      dropdownPlacement,
      container,
    } = this.props
    const { show } = this.state

    return (
      <div>
        <div
          className={classes[`iconSettingsButton${show ? 'Active' : ''}`]}
          ref={this.onRefButton}
        >
          <Icon
            name={icon}
            onClick={this.onShowDropdown}
            isPrivate={!isPublic}
            theme={{ ...iconTheme, backgroundColor }}
            showPrivateStatus
          />
        </div>
        {show && (
          <Dropdown
            container={container}
            placement={dropdownPlacement}
            onOutsideClick={this.onClickOutsideDropdown}
            target={this.button}
          >
            <IconSettings {...this.props} theme={{ classes }} />
          </Dropdown>
        )}
      </div>
    )
  }
}
