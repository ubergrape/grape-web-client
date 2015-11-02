import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from '../jss'
import style from './style'
import SidebarPanel from '../sidebar-panel/SidebarPanel'

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
          <div className={classes.avatarWrap}>
            <img
              className={classes.avatar}
              src={this.props.avatar}
              alt={this.props.username}
              width="80"
              height="80" />
          </div>
          <div className={classes.fullName}>
            {this.props.displayName}
          </div>
          <div className={classes.username}>
            {this.props.slug}
          </div>
          <div className={classes.item}>
            {this.props.whatIDo}
          </div>
          <div className={classes.item}>
            <a href={`mailto:${this.props.email}`}>
              {this.props.email}
            </a>
          </div>
          <div className={classes.item}>
            <a href={`skype:${this.props.skypeUsername}`}>
              {this.props.skypeUsername}
            </a>
          </div>
          <div className={classes.item}>
            <a href={`tel:${this.props.phoneNumber}`}>
              {this.props.phoneNumber}
            </a>
          </div>
        </div>
      </SidebarPanel>
    )
  }
}
