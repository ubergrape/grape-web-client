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
    showPrivateStatus: false
  }

  render() {
    const {
      name, icon, color: backgroundColor,
      statusBorderColor, isPublic, showPrivateStatus,
      sheet: {classes}
    } = this.props

    return (
      <span className={classes.avatarName}>
        <Icon
          name={icon}
          theme={{
            statusBorderColor,
            backgroundColor
          }}
          showPrivateStatus={showPrivateStatus}
          isPrivate={!isPublic} />
        <span className={classes.name}>
          {name}
        </span>
      </span>
    )
  }
}
