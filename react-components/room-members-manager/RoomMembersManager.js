import React, {Component} from 'react'
import List from 'react-finite-list'
import {constants} from 'conf'

export default class RoomMembersManager extends Component {
  render() {
    return(
      <div className='members'>
          <div className='right-sidebar-header'>
            <span className='title'>
              Members
            </span>
          </div>
          <List
            items={this.props.users}
            className='user-list'
            renderItem={::this.renderItem}
            ref='list' />
          <a
            className='invite-members'
            onClick={this.props.toggleRoomInvite}>
              Invite
          </a>
      </div>
    )
  }

  renderItem({item}) {
    let href = '/chat/' + item.slug
    let deleteButton
    let cUser = this.props.cUser

    if (cUser === this.roomCreator || cUser.role >= constants.roles.ROLE_ADMIN) {
      deleteButton = <span>X</span>
    }

    return(
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