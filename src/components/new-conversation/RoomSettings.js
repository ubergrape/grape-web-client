import React, {Component, PropTypes} from 'react'
import RoomIconSettings from '../room-icon-settings/RoomIconSettings'

export default class RoomSettings extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired
  }

  render() {
    return (
      <div className={this.props.theme.classes.settings}>
        <RoomIconSettings
          {...this.props}
          container={this} />
      </div>
    )
  }
}
