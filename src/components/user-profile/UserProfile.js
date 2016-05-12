import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import {useSheet} from 'grape-web/lib/jss'
import SidebarPanel from '../sidebar-panel/SidebarPanel'
import style from './style'

@useSheet(style)
export default class UserProfile extends Component {
  static propTypes = {
    hideSidebar: PropTypes.func.isRequired,
    sheet: PropTypes.object.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    whatIDo: PropTypes.string,
    skypeUsername: PropTypes.string,
    phoneNumber: PropTypes.string
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onClose() {
    this.props.hideSidebar()
  }

  render() {
    const {classes} = this.props.sheet
    const {
      avatar,
      username,
      displayName,
      whatIDo,
      email,
      skypeUsername,
      phoneNumber
    } = this.props
    return (
      <SidebarPanel
        title="User Profile"
        onClose={::this.onClose}>
        <div className={classes.profile}>
          <div className={classes.leftColumn}>
            <img
              className={classes.avatar}
              src={avatar}
              alt={username} />
          </div>
          <div className={classes.rightColumn}>
            <div className={classes.fullName}>
              {displayName}
            </div>
          </div>
        </div>
        <div>
          {whatIDo && <div className={classes.about}>
            <p>What I do:</p>
            <p>{whatIDo}</p>
          </div>}
          <a href={`mailto:${email}`} className={classes.email}>
            {email}
          </a>
          {skypeUsername && <a href={`skype:${skypeUsername}`} className={classes.skype}>
            {skypeUsername}
          </a>}
          {phoneNumber && <a href={`tel:${phoneNumber}`} className={classes.phone}>
            {phoneNumber}
          </a>}
        </div>
      </SidebarPanel>
    )
  }
}
