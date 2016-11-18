import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {white} from 'grape-theme/dist/base-colors'

import style from './userStyle'
import Avatar from '../avatar/Avatar'

const Status = ({theme, status, borderColor}) => (
  <i
    className={`${theme.status} ${theme[status]}`}
    style={{borderColor}}>
  </i>
)

Status.propTypes = {
  borderColor: PropTypes.string,
  theme: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired
}

Status.defaultPros = {
  borderColor: white
}

@injectSheet(style)
export default class Username extends PureComponent {
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
    const {
      name,
      avatar,
      showStatus,
      status,
      statusBorderColor,
      sheet: {classes}
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
