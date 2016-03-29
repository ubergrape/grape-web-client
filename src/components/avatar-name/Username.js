import React, {Component, PropTypes} from 'react'

import style from './userStyle'
import {useSheet} from 'grape-web/lib/jss'

@useSheet(style)
export default class Username extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    size: PropTypes.number,
    showStatus: PropTypes.bool,
    status: PropTypes.string,
    statusBorderColor: PropTypes.string
  }

  static defaultProps = {
    size: 32,
    showStatus: true,
    statusBorderColor: '#ffffff'
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
    const {size} = this.props
    const sizes = {width: size, height: size}
    const {classes} = this.props.sheet
    const {
      name,
      avatar,
      showStatus,
      status
    } = this.props

    return (
      <span className={classes.avatarName}>
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
        <span className={classes.name}>
          {name}
        </span>
      </span>
    )
  }
}
