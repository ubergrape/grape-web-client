import React, {Component} from 'react'
import List from 'react-finite-list'
import {constants} from 'conf'
import {useSheet} from '../jss'
import style from './style'

@useSheet(style)
export default class RoomInfo extends Component {
  render() {
    let {classes} = this.props.sheet
    let plural = this.props.users.length > 1 ? 's' : ''
    return(
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
            onClick={this.props.toggleRoomInvite}>
              Invite
          </button>
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