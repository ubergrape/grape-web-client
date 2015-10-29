import React, {Component} from 'react'
import List from 'react-finite-list'
import {constants} from 'conf'
import {useSheet} from '../jss'
import style from './style'

@useSheet(style)
export default class RoomInfo extends Component {
  static defaultProps = {
    show: false
  }

  onInvite() {
    this.props.toggleRoomInvite()
  }

  onDelete(e) {
    this.props.kickMember(e)
  }

  onLeave() {
    this.props.leaveRoom()
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
      <div className='room-info'>
        <div>
          The room {channel.name} has {users.length} member{plural}{creatorText}.
        </div>
        <div onClick={::this.onInvite}>
          <a>Invite more people to this room</a>
        </div>
        <div onClick={::this.onLeave}>
          <a>Leave {channel.name}</a>
        </div>
        <List
          items={users}
          className='user-list'
          renderItem={::this.renderItem}
          ref='list' />
      </div>
    )
  }

  renderItem({item}) {
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
          className="kick-member"
          data-id={item.id}
          onClick={::this.onDelete}>
          X
        </span>
      )
    }

    return (
      <div>
        <a href={href}>
          <aside className='avatar-wrap'>
            <img
              className='image'
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
