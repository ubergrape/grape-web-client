import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import color from 'color'
import { small } from 'grape-theme/dist/fonts'
import {
  blue,
  grayBlueLighter,
  grayBlueDark,
} from 'grape-theme/dist/base-colors'

import { userStatusMap } from '../../../constants/app'
import { Username } from '../../avatar-name'
import buttonIcon from '../../button/icon'

const hoverColor = color(blue)
  .lighten(0.05)
  .rgbaString()

@injectSheet({
  row: {
    display: 'flex',
    marginBottom: 10,
    '&, & *': {
      isolate: false,
      cursor: 'pointer',
    },
    '&:hover $buttonKick': {
      isolate: false,
      opacity: 1,
    },
  },
  userNameContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  name: {
    color: grayBlueDark,
  },
  buttonKick: {
    extend: [
      buttonIcon('close', { color: grayBlueDark, hoverColor, iconOnly: true }),
      small,
    ],
    flexShrink: 0,
    opacity: 0,
    marginLeft: 10,
  },
})
export default class User extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    onKick: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
    permissions: PropTypes.shape({
      canRemoveMembers: PropTypes.bool,
    }),
  }

  static defaultProps = {
    permissions: {
      canRemoveMembers: true,
    },
  }

  constructor(props) {
    super(props)
    const { classes } = props
    this.userNameTheme = {
      classes: {
        name: classes.name,
      },
    }
  }

  onKickMember = () => {
    const { onKick, channel, user } = this.props
    onKick({
      channelId: channel.id,
      userId: user.id,
    })
  }

  onSelectMember = () => {
    const { user, onOpen } = this.props
    onOpen(user.id)
  }

  render() {
    const { classes, user, permissions } = this.props

    return (
      <div className={classes.row}>
        <button
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
        </button>
        {permissions.canRemoveMembers && (
          <button className={classes.buttonKick} onClick={this.onKickMember} />
        )}
      </div>
    )
  }
}
