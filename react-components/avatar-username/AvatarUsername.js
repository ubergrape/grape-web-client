import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'

@useSheet(style)
export default class AvatarUsername extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    size: PropTypes.number,
    showStatus: PropTypes.bool,
    status: PropTypes.string,
    statusBorderColor: PropTypes.string
  }

  static defaultProps = {
    size: 32,
    showStatus: true,
    statusBorderColor: '#FFFFFF'
  }

  renderStatus() {
    const {
      sheet,
      showStatus,
      status,
      statusBorderColor
    } = this.props

    if (!showStatus) return null

    const {classes} = sheet
    return (
      <i
        className={`${classes.status} ${classes[status]}`}
        style={{borderColor: statusBorderColor}}>
      </i>
    )
  }

  render() {
    const size = this.props.size
    const sizes = {width: size, height: size}
    const {classes} = this.props.sheet
    const {
      username,
      avatar,
      showStatus,
      status
    } = this.props

    return (
      <span className={classes.avatarUsername}>
        <span className={classes.avatar}>
          <span
            className={classes.image}
            style={sizes}>
            <img
              style={sizes}
              src={avatar}
              alt={showStatus ? status : ''} />
          </span>
          {this.renderStatus()}
        </span>
        <span className={classes.username}>
          {username}
        </span>
      </span>
    )
  }
}
