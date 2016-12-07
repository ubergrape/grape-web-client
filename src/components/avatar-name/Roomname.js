import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import style from './roomStyle'
import Icon from '../room-icon/RoomIcon'

@injectSheet(style)
export default class Roomname extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    color: PropTypes.string.isRequired,
    statusBorderColor: PropTypes.string.isRequired,
    isPublic: PropTypes.bool.isRequired,
    showPrivateStatus: PropTypes.bool.isRequired
  }

  static defaultProps = {
    color: '#f00',
    statusBorderColor: '#fff',
    mentions: false,
    unread: 0,
    showPrivateStatus: false,
    showRoomInfo: false
  }

  render() {
    const {
      name, icon, color: backgroundColor,
      creatorUser, users, showRoomInfo,
      statusBorderColor, isPublic, showPrivateStatus,
      sheet: {classes}
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
          isPrivate={!isPublic} />
        <div className={classes.name}>
          <div>{name}</div>
          {showRoomInfo && (
            <ul className={classes.info}>
              <li className={classes.usersCount}>
                <i className="mdi mdi-account-multiple"></i>
                {users.length}
              </li>
              {creatorUser && (
                <li className={classes.creator}>
                  <i className="mdi mdi-account-box"></i>
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
