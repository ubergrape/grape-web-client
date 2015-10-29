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

  render() {
    if (!this.props.show) return null
    let {classes} = this.props.sheet
    let {channel} = this.props
    let users = channel.users.toArray()
    let plural = users.length > 1 ? 's' : ''
    return (
      <div className='members'>
          <div className='header'>
            <span className='title'>
              {`${users.length} Member${plural}`}
            </span>
          </div>
          <List
            items={users}
            className='user-list'
            renderItem={::this.renderItem}
            ref='list' />
          <button
            className={classes.button}
            onClick={::this.onInvite}>
              Invite
          </button>
      </div>
    )
  }

  renderItem({item}) {
    let {channel} = this.props
    let href = `/chat/${item.slug}`
    let deleteButton
    let user = this.props.user
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
