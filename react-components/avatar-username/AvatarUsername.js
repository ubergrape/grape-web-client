import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'

@useSheet(style)
export default class AvatarUsername extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired
  }

  static defaultProps = {
    size: 32,
    showStatus: true,
    statusBorderColor: '#FFFFFF'
  }

  renderStatus() {
    if (!this.props.showStatus) return null

    const {
      sheet,
      status,
      statusBorderColor
    } = this.props
    const {classes} = sheet

    return (
      <i
        className={
          `${classes.status} ${classes[this.props.status]}`
        }
        style={{borderColor: statusBorderColor}}
        ></i>
    )
  }

  render() {
    const size = `${this.props.size}px`
    const wh = {width: size, height: size}
    const {
      avatarUsername,
      avatar,
      username,
      image
    } = this.props.sheet.classes

    return (
      <span
        className={avatarUsername}>
        <span
          className={avatar}>
          <span
            className={image}
            style={wh}>
            <img
              style={wh}
              src={this.props.avatar}
              alt="" />
          </span>
          {this.renderStatus()}
        </span>
        <span
          className={username}>
          {this.props.username}
        </span>
      </span>
    )
  }
}
