import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import cn from 'classnames'

import style from './roomStyle'
import Icon from '../room-icon/RoomIcon'

const Roomname = ({
  name,
  icon,
  color: backgroundColor,
  creatorUser,
  membersCount,
  showRoomInfo,
  statusBorderColor,
  isPublic,
  showPrivateStatus,
  classes,
  className,
  theme,
}) => (
  <div className={cn(classes.avatarName, theme.classes.avatarName, className)}>
    <Icon
      name={icon}
      theme={{
        statusBorderColor,
        backgroundColor,
      }}
      showPrivateStatus={showPrivateStatus}
      isPrivate={!isPublic}
    />
    <div className={cn(classes.name, theme.classes.name)}>
      {name}
      {showRoomInfo && (
        <ul className={classes.info}>
          <li>
            <span className={classes.membersCountIcon} />
            {membersCount}
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

Roomname.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  icon: PropTypes.string,
  creatorUser: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }),
  color: PropTypes.string,
  isPublic: PropTypes.bool,
  showPrivateStatus: PropTypes.bool,
  showRoomInfo: PropTypes.bool,
  statusBorderColor: PropTypes.string,
  membersCount: PropTypes.number,
  className: PropTypes.string,
  theme: PropTypes.object,
}

Roomname.defaultProps = {
  name: '',
  className: undefined,
  creatorUser: undefined,
  membersCount: undefined,
  icon: undefined,
  color: '#f00',
  statusBorderColor: '#fff',
  showPrivateStatus: false,
  showRoomInfo: false,
  isPublic: false,
  theme: { classes: {} },
}

export default injectSheet(style)(Roomname)
