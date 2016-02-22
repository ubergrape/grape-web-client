import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import AvatarUsername from '../avatar-username/AvatarUsername'
import AvatarRoomname from '../avatar-roomname/AvatarRoomname'
import {userStatus} from '../constants/app'
import style from './style'
import colors from 'grape-theme/dist/base-colors'

@useSheet(style)
export default class Navigation extends Component {

  static propTypes = {
    sheet: PropTypes.object.isRequired,
    showChannelsManager: PropTypes.func.isRequired,
    showPMsManager: PropTypes.func.isRequired,
    goToChannel: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired,
    recent: PropTypes.array.isRequired
  }

  goToChannel(channel) {
    this.props.goToChannel(channel.slug || channel.mate.slug)
  }

  renderManageButtons() {
    const {
      sheet,
      showChannelsManager,
      showPMsManager
    } = this.props

    return (
      <ul className={sheet.classes.manage}>
        <li className={sheet.classes.manageItem}>
          <button
            className={sheet.classes.contacts}
            onClick={showPMsManager}>
            Contacts
          </button>
        </li>
        <li className={sheet.classes.manageItem}>
          <button
            className={sheet.classes.groups}
            onClick={showChannelsManager}>
            Groups
          </button>
        </li>
      </ul>
    )
  }

  renderRoom(room) {
    const {sheet, channel} = this.props
    const isCurrent = channel.type === 'room' && channel.id === room.id
    const className = sheet.classes.channel + (isCurrent ? ` ${sheet.classes.currentRoom}` : '')
    return (
      <li
        key={room.id}
        style={isCurrent ? {background: room.color} : null }
        className={className}
        onClick={this.goToChannel.bind(this, room)}>
        <AvatarRoomname {...room} />
      </li>
    )
  }

  renderPM(pm) {
    const {sheet, channel} = this.props
    const {mate} = pm
    const isCurrent = channel.type === 'pm' && channel.id === pm.id
    const className = sheet.classes.channel + (isCurrent ? ` ${sheet.classes.currentPM}` : '')
    return (
      <li
        key={pm.id}
        className={className}
        onClick={this.goToChannel.bind(this, pm)}>
        <AvatarUsername
          statusBorderColor={isCurrent ? colors.blue : colors.grayBlueLighter}
          avatar={mate.avatar}
          status={userStatus[mate.status]}
          name={mate.displayName} />
      </li>
    )
  }

  renderRecentList() {
    const {classes} = this.props.sheet
    return (
      <div className={classes.section}>
        <h2 className={`${classes.title} ${classes.recent}`}>Recent</h2>
        <ol className={classes.list}>
          {
            this.props.recent.map(channel => {
              if (channel.type === 'room') return this.renderRoom(channel)
              if (channel.type === 'pm') return this.renderPM(channel)
              return null
            })
          }
        </ol>
      </div>
    )
  }

  render() {
    const {classes} = this.props.sheet
    return (
      <div className={classes.navigation}>
        {this.renderManageButtons()}
        {this.renderRecentList()}
      </div>
    )
  }
}
