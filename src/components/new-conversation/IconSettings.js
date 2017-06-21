import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'

import {RoomIconSettings} from '../room-icon-settings'

export default class IconSettings extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  render() {
    const {classes, ...rest} = this.props
    return (
      <div className={classes.icon}>
        <RoomIconSettings
          {...rest}
          container={this}
          dropdownPlacement="top"
        />
      </div>
    )
  }
}
