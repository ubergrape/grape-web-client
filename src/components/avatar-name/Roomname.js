import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import injectSheet from 'grape-web/lib/jss'

import style from './roomStyle'
import Icon from '../room-icon/RoomIcon'

@injectSheet(style)
export default class Roomname extends Component {
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

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
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
