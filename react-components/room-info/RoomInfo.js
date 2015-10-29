import React, {Component} from 'react'
import List from 'react-finite-list'
import noop from 'lodash/utility/noop'
import {constants} from 'conf'
import {useSheet} from '../jss'
import style from './style'
import tz from 'moment-timezone'

const dateFormat = 'MMMM Do, YYYY'

@useSheet(style)
export default class RoomInfo extends Component {
  static defaultProps = {
    show: false,
    onKickMember: noop,
    onInvite: noop,
    onLeave: noop
  }

  onInvite() {
    this.props.onInvite()
  }

  onKickMember({id}) {
    this.props.onKickMember({id})
  }

  onLeave() {
    this.props.onLeave()
  }

  render() {
    if (!this.props.show) return null
    let {classes} = this.props.sheet
    let {channel} = this.props
    let users = channel.users.toArray()
    let plural = users.length > 1 ? 's' : ''
    let creatorText
    if (channel.creator) {
      creatorText = ` and has been created by ${channel.creator.displayName}`
    }

    return (
      <div className={classes.roomInfo}>
        <div>
          The room {channel.name} has {users.length} member{plural}{creatorText} on {tz(channel.created).format(dateFormat)}.
        </div>
        <div onClick={::this.onInvite}>
          <a>Invite more people to this room</a>
        </div>
        <div onClick={::this.onLeave}>
          <a>Leave {channel.name}</a>
        </div>
        <List
          items={users}
          className={classes.userList}
          renderItem={::this.renderItem} />
      </div>
    )
  }

  renderItem({item}) {
    let {classes} = this.props.sheet
    let {channel} = this.props
    let href = `/chat/${item.slug}`
    let deleteButton
    let {user} = this.props
    let canUserKick = user === channel.creator || user.role >= constants.roles.ROLE_ADMIN
    // user has be have the rights to kick
    // user should not be able to kick itself
    // user should not be able to kick the creator of the room
    if (canUserKick && user !== item && item !== channel.creator) {
      deleteButton = (
        <span
          className={classes.deleteButton}
          onClick={this.onKickMember.bind(this, item)}>
          X
        </span>
      )
    }

    return (
      <div>
        <a href={href}>
          <aside className={classes.avatarWrap}>
            <img
              className={classes.avatar}
              width='20'
              height='20'
              src={item.avatar} />
          </aside>
          <span>
            {item.displayName}
          </span>
        </a>
        {deleteButton}
      </div>
    )
  }
}
