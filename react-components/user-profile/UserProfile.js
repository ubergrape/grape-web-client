import React, {Component} from 'react'
import {useSheet} from '../jss'
import style from './style'

@useSheet(style)
export default class UserProfile extends Component {
  static defaultProps = {
    show: false
  }

  render() {
    if (!this.props.show) return null
    const {user} = this.props
    let {classes} = this.props.sheet
    return (
      <div className={classes.profile}>
        <div className={classes.avatarWrap}>
          <img
            className={classes.avatar}
            src={user.avatar}
            alt={user.username}
            width="80"
            height="80" />
        </div>
        <div className={classes.fullName}>
          {user.displayName}
        </div>
        <div className={classes.username}>
          {user.slug}
        </div>
        <div className={classes.item}>
          {user.what_i_do}
        </div>
        <div className={classes.item}>
          <a href={`mailto:${user.email}`}>
            {user.email}
          </a>
        </div>
        <div className={classes.item}>
          <a href={`skype:${user.skype_username}`}>
            {user.skype_username}
          </a>
        </div>
        <div className={classes.item}>
          <a href={`tel:${user.phone_number}`}>
            {user.phone_number}
          </a>
        </div>
      </div>
    )
  }
}
