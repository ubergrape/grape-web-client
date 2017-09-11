import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import color from 'color'
import {small, normal} from 'grape-theme/dist/fonts'
import {blue, grayBlueLighter, grayBlueDark} from 'grape-theme/dist/base-colors'

import {userStatusMap} from '../../../constants/app'
import {Username} from '../../avatar-name'
import {getRoles} from './utils'
import buttonIcon from '../../button/icon'

const hoverColor = color(blue).lighten(0.05).rgbaString()

@injectSheet({
  row: {
    display: 'flex',
    marginBottom: 10,
    '&, & *': {
      isolate: false,
      cursor: 'pointer'
    },
    '&:hover $buttonKick': {
      isolate: false,
      opacity: 1
    }
  },
  userNameContainer: {
    flex: 1,
    overflow: 'hidden'
  },
  name: {
    extend: normal,
    color: grayBlueDark
  },
  buttonKick: {
    extend: [
      buttonIcon('close', {color: grayBlueDark, hoverColor, iconOnly: true}),
      small
    ],
    flexShrink: 0,
    opacity: 0,
    marginLeft: 10
  }
})
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
            statusBorderColor={grayBlueLighter}
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
