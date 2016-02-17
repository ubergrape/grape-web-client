import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import isEmpty from 'lodash/lang/isEmpty'
import {useSheet} from 'grape-web/lib/jss'
import SidebarPanel from '../sidebar-panel/SidebarPanel'
import style from './style'

@useSheet(style)
export default class UserProfile extends Component {
  static propTypes = {
    hideUserProfile: PropTypes.func.isRequired,
    sheet: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onClose() {
    this.props.hideUserProfile()
  }

  render() {
    const {show, user} = this.props
    if (!show || isEmpty(user)) return null

    const {classes} = this.props.sheet
    return (
      <SidebarPanel
        title="User Profile"
        onClose={::this.onClose}>
        <div className={classes.profile}>
          <div className={classes.leftColumn}>
            <img
              className={classes.avatar}
              src={user.avatar}
              alt={user.username} />
          </div>
          <div className={classes.rightColumn}>
            <div className={classes.fullName}>
              {user.displayName}
            </div>
            {user.whatIDo && <div className={classes.about}>
              <p>What I do:</p>
              <p>{user.whatIDo}</p>
            </div>}
            <a href={`mailto:${user.email}`} className={classes.email}>
              {user.email}
            </a>
            {user.skypeUsername && <a href={`skype:${user.skypeUsername}`} className={classes.skype}>
              {user.skypeUsername}
            </a>}
            {user.phoneNumber && <a href={`tel:${user.phoneNumber}`} className={classes.phone}>
              {user.phoneNumber}
            </a>}
          </div>
        </div>
      </SidebarPanel>
    )
  }
}
