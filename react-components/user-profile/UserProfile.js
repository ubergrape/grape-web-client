import React, {Component} from 'react'

export default class UserProfile extends Component {
  render() {
    let user = this.props.user
    return(
      <div className='profile'>
        <div className='avatar-wrap'>
          <img
          src={user.avatar}
          alt={user.username}
          width="80"
          height="80" />
        </div>
        <div className="fullname">
          {user.displayName}
        </div>
        <div className="username">
          {user.slug}
        </div>
        <div className="user-profile-item">
          {user.what_i_do}
        </div>
        <div className="user-profile-item">
          <a href={`mailto:${user.email}`}>
            {user.email}
          </a>
        </div>
        <div className="user-profile-item">
          <a href={`skype:${user.skype_username}`}>
            {user.skype_username}
          </a>
        </div>
        <div className="user-profile-item">
          <a href={`tel:${user.phone_number}`}>
            {user.phone_number}
          </a>
        </div>
      </div>
    )
  }
}