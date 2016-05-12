import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import {white} from 'grape-theme/dist/base-colors'

import style from './userStyle'
import Avatar from '../avatar/Avatar'

function Status({theme, status, borderColor}) {
  return (
    <i
      className={`${theme.status} ${theme[status]}`}
      style={{borderColor}}>
    </i>
  )
}

Status.propTypes = {
  borderColor: PropTypes.string,
  theme: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired
}

Status.defaultPros = {
  borderColor: white
}

@useSheet(style)
export default class Username extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    showStatus: PropTypes.bool,
    status: PropTypes.string,
    statusBorderColor: PropTypes.string
  }

  static defaultProps = {
    showStatus: true
  }

  render() {
    const {classes} = this.props.sheet
    const {
      name,
      avatar,
      showStatus,
      status,
      statusBorderColor
    } = this.props

    return (
      <span className={classes.avatarName}>
        <Avatar
          src={avatar}
          className={classes.avatar}>
          {showStatus &&
            <Status
              theme={classes}
              status={status}
              borderColor={statusBorderColor} />
          }
        </Avatar>
        <span className={classes.name}>
          {name}
        </span>
      </span>
    )
  }
}
