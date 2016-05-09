import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import style from './roomStyle'
import Icon from '../room-icon/RoomIcon'

@useSheet(style)
export default class Roomname extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    color: PropTypes.string
  }

  static defaultProps = {
    color: '#ff0000',
    mentions: false,
    unread: 0
  }

  render() {
    const {name, sheet, icon, color} = this.props
    const {classes} = sheet
    return (
      <span className={classes.avatarName}>
        <Icon name={icon} backgroundColor={color} />
        <span className={classes.name}>
          {name}
        </span>
      </span>
    )
  }
}
