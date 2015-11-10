import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from 'grape-web/lib/jss'
import SidebarPanel from '../sidebar-panel/SidebarPanel'
import style from './style'

@useSheet(style)
export default class UserProfile extends Component {
  static defaultProps = {
    show: false,
    avatar: undefined,
    username: undefined,
    fullName: undefined,
    displayName: undefined,
    slug: undefined,
    whatIDo: undefined,
    email: undefined,
    skypeUsername: undefined,
    phoneNumber: undefined,
    onClose: noop
  }

  onClose() {
    this.props.onClose()
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    if (!this.props.show) return null
    const {classes} = this.props.sheet
    return (
      <SidebarPanel
        title="User Profile"
        onClose={::this.onClose}>
        <div className={classes.profile}>
          <div className={classes.leftColumn}>
            <img
              className={classes.avatar}
              src={this.props.avatar}
              alt={this.props.username} />
          </div>
          <div className={classes.rightColumn}>
            <div className={classes.fullName}>
              {this.props.displayName}
            </div>
            <div className={classes.username}>
              {this.props.slug}
            </div>
            {this.props.whatIDo && <div className={classes.about}>
              <p>What I do:</p>
              <p>{this.props.whatIDo}</p>
            </div>}
            <a href={`mailto:${this.props.email}`} className={classes.email}>
              {this.props.email}
            </a>
            {this.props.skypeUsername && <a href={`skype:${this.props.skypeUsername}`} className={classes.skype}>
              {this.props.skypeUsername}
            </a>}
            {this.props.phoneNumber && <a href={`tel:${this.props.phoneNumber}`} className={classes.phone}>
              {this.props.phoneNumber}
            </a>}
          </div>
        </div>
      </SidebarPanel>
    )
  }
}

