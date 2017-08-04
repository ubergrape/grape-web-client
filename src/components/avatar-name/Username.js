import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {white} from 'grape-theme/dist/base-colors'
import cn from 'classnames'

import style from './userStyle'
import Avatar from '../avatar/Avatar'

const Status = ({classes, status, borderColor}) => (
  <i
    className={`${classes.status} ${classes[status]}`}
    style={{borderColor}}
  />
)

Status.propTypes = {
  borderColor: PropTypes.string,
  classes: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired
}

Status.defaultProps = {
  borderColor: white
}

@injectSheet(style)
export default class Username extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
    showStatus: PropTypes.bool,
    status: PropTypes.string,
    statusBorderColor: PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    showStatus: true,
    theme: {classes: {}},
    className: undefined,
    statusBorderColor: undefined,
    status: 'online'
  }

  render() {
    const {
      name,
      avatar,
      showStatus,
      status,
      statusBorderColor,
      sheet: {classes},
      theme,
      className
    } = this.props

    return (
      <span className={cn(classes.avatarName, theme.classes.avatarName, className)}>
        <Avatar
          src={avatar}
          className={cn(classes.avatar, theme.classes.avatar)}
        >
          {showStatus &&
            <Status
              classes={classes}
              status={status}
              borderColor={statusBorderColor}
            />
          }
        </Avatar>
        <span className={cn(classes.name, theme.classes.name)}>
          {name}
        </span>
      </span>
    )
  }
}
