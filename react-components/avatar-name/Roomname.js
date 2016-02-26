import React, {Component, PropTypes} from 'react'

import style from './roomStyle'
import {useSheet} from 'grape-web/lib/jss'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'

@useSheet(style)
export default class Roomname extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    abbr: PropTypes.string
  }

  static defaultProps = {
    size: 32,
    color: '#ff0000',
    mentions: false,
    unread: 0
  }

  renderAbbr() {
    const {color, abbr, size, sheet} = this.props
    return (
      <span
        className={sheet.classes.abbr}
        style={{
          backgroundColor: color,
          lineHeight: `${size}px`
        }}>
        {abbr}
      </span>
    )
  }

  renderIcon() {
    const {icon: name, color, sheet} = this.props
    const icon = getColoredIcon({name, color: '#ffffff'})
    return (
      <span
        className={sheet.classes.icon}
        style={{
          background: `url("${icon}") 50% 50% no-repeat`,
          backgroundColor: color,
          backgroundSize: '40% auto'
        }}></span>
    )
  }

  renderAvatar() {
    const {size, icon, sheet} = this.props
    const sizes = {width: size, height: size}
    return (
      <span
        className={sheet.classes.avatar}
        style={sizes}>
        {icon ? this.renderIcon() : this.renderAbbr()}
      </span>
    )
  }

  render() {
    const {name, sheet} = this.props
    return (
      <span className={sheet.classes.avatarName}>
        {this.renderAvatar()}
        <span className={sheet.classes.name}>
          {name}
        </span>
      </span>
    )
  }
}
