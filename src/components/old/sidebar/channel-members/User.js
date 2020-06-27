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
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

import { userStatusMap } from '../../../../constants/app'
import { UserName } from '../../avatar-name'
import buttonIcon from '../../button/icon'
import { getRoles } from '../utils'

const hoverColor = color(blue)
  .lighten(0.05)
  .rgbaString()

class User extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    currUser: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    onKick: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
    permissions: PropTypes.object,
  }

  static defaultProps = {
    permissions: {},
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

  renderDeleteButton() {
    const { channel, user, currUser, classes, permissions } = this.props
    const { isAdmin, isCreator } = getRoles({ channel, user: currUser })
    const isSelf = currUser.id === user.id
    const hasCreated = channel.creator === user.id
    const isKickMaster = (isAdmin || isCreator) && !isSelf

    if (!isKickMaster || isSelf || hasCreated || !permissions.canRemoveMembers)
      return null

    return <button className={classes.buttonKick} onClick={this.onKickMember} />
  }

  render() {
    const { classes, user } = this.props

    return (
      <div className={classes.row}>
        <button
          className={classes.userNameContainer}
          onClick={this.onSelectMember}
        >
          <UserName
            statusBorderColor={grayBlueLighter}
            avatar={user.avatar}
            status={userStatusMap[user.status]}
            name={user.displayName}
            theme={this.userNameTheme}
          />
        </button>
        {this.renderDeleteButton()}
      </div>
    )
  }
}

export default injectSheet({
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
    '&:hover:before': {
      isolate: false,
      verticalAlign: 'top',
      content: '""',
      cursor: 'pointer',
      font: 'inherit',
      width: '1em',
      height: '1em',
      backgroundSize: 'contain',
      backgroundImage: ({ colors }) =>
        `url('${getColoredIcon({
          name: 'close',
          color: `${colors.button || blue}`,
        })}')`,
      backgroundRepeat: 'no-repeat',
    },
  },
})(User)
