import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import {white} from 'grape-theme/dist/base-colors'

import style from './roomStyle'
import Avatar from '../avatar/Avatar'

function Icon({name, color: backgroundColor}) {
  const src = getColoredIcon({name, color: white})
  return <Avatar src={src} style={{backgroundColor}} />
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
}

function Abbr({abbr, color: backgroundColor, className}) {
  return (
    <Avatar
      className={className}
      style={{backgroundColor}}>
      {abbr}
    </Avatar>
  )
}

Abbr.propTypes = {
  abbr: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired
}

@useSheet(style)
export default class Roomname extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    color: PropTypes.string,
    abbr: PropTypes.string
  }

  static defaultProps = {
    color: '#ff0000',
    mentions: false,
    unread: 0
  }

  render() {
    const {name, icon, abbr, color, sheet} = this.props
    const {classes} = sheet
    return (
      <span className={classes.avatarName}>
        {icon && <Icon name={icon} color={color} />}
        {!icon && <Abbr abbr={abbr} color={color} className={classes.abbr} />}
        <span className={classes.name}>
          {name}
        </span>
      </span>
    )
  }
}
