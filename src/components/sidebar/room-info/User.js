import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import colors from 'grape-theme/dist/base-colors'
import injectSheet from 'grape-web/lib/jss'

import {userStatusMap} from '../../../constants/app'
import {Username} from '../../avatar-name'
import {getRoles} from './utils'
import {styles} from './userTheme'

@injectSheet(styles)
export default class User extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    currUser: PropTypes.object.isRequired,
    kickMemberFromChannel: PropTypes.func.isRequired,
    goToChannel: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    const {classes} = props
    this.userNameTheme = {
      classes: {
        name: classes.name
      }
    }
  }

  onKickMember = () => {
    const {kickMemberFromChannel, channel, user} = this.props
    kickMemberFromChannel({
      channelId: channel.id,
      userId: user.id
    })
  }

  onSelectMember = () => {
    const {user, goToChannel} = this.props
    goToChannel(user.slug)
  }

  renderDeleteButton() {
    const {channel, user, currUser, classes} = this.props
    const {isAdmin, isCreator} = getRoles({channel, user: currUser})
    const isSelf = currUser.id === user.id
    const hasCreated = channel.creator === user.id
    const isKickMaster = (isAdmin || isCreator) && !isSelf

    if (!isKickMaster || isSelf || hasCreated) return null

    return (
      <button
        className={classes.buttonKick}
        onClick={this.onKickMember}
      />
    )
  }

  render() {
    const {classes, user} = this.props

    return (
      <div className={classes.row}>
        <div
          className={classes.userNameContainer}
          onClick={this.onSelectMember}
        >
          <Username
            statusBorderColor={colors.grayBlueLighter}
            avatar={user.avatar}
            status={userStatusMap[user.status]}
            name={user.displayName}
            theme={this.userNameTheme}
          />
        </div>
        {this.renderDeleteButton()}
      </div>
    )
  }
}
