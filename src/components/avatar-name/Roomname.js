import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import style from './roomStyle'
import Icon from '../room-icon/RoomIcon'

@injectSheet(style)
export default class Roomname extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string,
    icon: PropTypes.string,
    creatorUser: PropTypes.shape({
      displayName: PropTypes.string.isRequired
    }),
    color: PropTypes.string,
    statusBorderColor: PropTypes.string,
    isPublic: PropTypes.bool,
    showPrivateStatus: PropTypes.bool,
    showRoomInfo: PropTypes.bool,
    users: PropTypes.array
  }

  static defaultProps = {
    name: '',
    creatorUser: null,
    icon: undefined,
    color: '#f00',
    statusBorderColor: '#fff',
    mentions: false,
    unread: 0,
    showPrivateStatus: false,
    showRoomInfo: false,
    isPublic: false,
    users: []
  }

  render() {
    const {
      name, icon, color: backgroundColor,
      creatorUser, users, showRoomInfo,
      statusBorderColor, isPublic, showPrivateStatus,
      classes
    } = this.props

    return (
      <div className={classes.avatarName}>
        <Icon
          name={icon}
          theme={{
            statusBorderColor,
            backgroundColor
          }}
          showPrivateStatus={showPrivateStatus}
          isPrivate={!isPublic}
        />
        <div className={classes.name}>
          {name}
          {showRoomInfo && (
            <ul className={classes.info}>
              <li>
                <span className={classes.usersCountIcon} />
                {users.length}
              </li>
              {creatorUser && (
                <li className={classes.creator}>
                  <span className={classes.creatorIcon} />
                  {creatorUser.displayName}
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    )
  }
}
