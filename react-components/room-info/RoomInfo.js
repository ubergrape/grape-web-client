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

  onRoomInviteClick() {
    this.props.toggleRoomInvite()
  }

  onDeleteButtonClick(e) {
    this.props.kickMember(e)
  }

  render() {
    if (!this.props.show) return null
    let {classes} = this.props.sheet
    let plural = this.props.users.length > 1 ? 's' : ''
    return (
      <div className='members'>
          <div className='header'>
            <span className='title'>
              {`${this.props.users.length} Member${plural}`}
            </span>
          </div>
          <List
            items={this.props.users}
            className='user-list'
            renderItem={::this.renderItem}
            ref='list' />
          <button
            className={classes.button}
            onClick={::this.onRoomInviteClick}>
              Invite
          </button>
      </div>
    )
  }

  renderItem({item}) {
    let href = `/chat/${item.slug}`
    let deleteButton
    let user = this.props.user
    let canUserKick = user === this.props.roomCreator || user.role >= constants.roles.ROLE_ADMIN
    if (canUserKick && user !== item && item !== this.props.roomCreator) {
      deleteButton = (
        <span
          className="kick-member"
          data-id={item.id}
          onClick={::this.onDeleteButtonClick}>
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
