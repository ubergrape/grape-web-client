import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import AvatarUsername from '../avatar-username/AvatarUsername'
import {userStatus} from '../constants/app'
import style from './style'

@useSheet(style)
export default class Navigation extends Component {

  static propTypes = {
    sheet: PropTypes.object.isRequired,
    showChannelsManager: PropTypes.func.isRequired,
    showPMsManager: PropTypes.func.isRequired,
    recent: PropTypes.array.isRequired
  }

  goToChannel(channel) {
    console.log(channel)
  }

  renderManageButtons() {
    const {
      sheet,
      showChannelsManager,
      showPMsManager
    } = this.props

    return (
      <ul>
        <li>
          <button
            className={sheet.classes.contacts}
            onClick={showPMsManager}>
            Contacts
          </button>
        </li>
        <li>
          <button
            className={sheet.classes.groups}
            onClick={showChannelsManager}>
            Groups
          </button>
        </li>
      </ul>
    )
  }

  renderRoom(channel) {
    return (
      <li
        key={channel.id}
        onClick={this.goToChannel.bind(this, channel)}>
        {`${channel.abbr} ${channel.name}`}
      </li>
    )
  }

  renderPM(pm) {
    const {mate} = pm
    return (
      <li
        key={pm.id}
        onClick={this.goToChannel.bind(this, pm)}>
        <AvatarUsername
          avatar={mate.avatar}
          status={userStatus[mate.status]}
          username={mate.displayName} />
      </li>
    )
  }

  renderRecentList() {
    return (
      <ol>
        {
          this.props.recent.map(channel => {
            if (channel.type === 'room') return this.renderRoom(channel)
            if (channel.type === 'pm') return this.renderPM(channel)
            return null
          })
        }
      </ol>
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
