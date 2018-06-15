import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

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
    membersCount: PropTypes.number,
    className: PropTypes.string,
    theme: PropTypes.object
  }

  static defaultProps = {
    name: '',
    className: undefined,
    creatorUser: undefined,
    membersCount: undefined,
    icon: undefined,
    color: '#f00',
    statusBorderColor: '#fff',
    mentions: false,
    unread: 0,
    showPrivateStatus: false,
    showRoomInfo: false,
    isPublic: false,
    theme: {classes: {}}
  }

  render() {
    const {
      name, icon, color: backgroundColor,
      creatorUser, membersCount, showRoomInfo,
      statusBorderColor, isPublic, showPrivateStatus,
      classes, className,
      theme
    } = this.props

    return (
      <div className={cn(classes.avatarName, theme.classes.avatarName, className)}>
        <Icon
          name={icon}
          theme={{
            statusBorderColor,
            backgroundColor
          }}
          showPrivateStatus={showPrivateStatus}
          isPrivate={!isPublic}
        />
        <div className={cn(classes.name, theme.classes.name)}>
          {name}
          {showRoomInfo && (
            <div className={classes.info}>
              <div>
                <span className={classes.membersCountIcon} />
                {membersCount}
              </div>
              {creatorUser && (
                <div className={classes.creator}>
                  <span className={classes.creatorIcon} />
                  {creatorUser.displayName}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}
