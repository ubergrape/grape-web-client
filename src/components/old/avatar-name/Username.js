import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { white } from 'grape-theme/dist/base-colors'
import cn from 'classnames'

import { defaultAvatar } from '../../../constants/images'
import Avatar from '../avatar/Avatar'
import style from './userStyle'

const Status = ({ classes, status, borderColor }) => (
  <i
    className={`${classes.status} ${classes[status]}`}
    style={{ borderColor }}
  />
)

Status.propTypes = {
  borderColor: PropTypes.string,
  classes: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
}

Status.defaultProps = {
  borderColor: white,
}

class Username extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    theme: PropTypes.object,
    avatar: PropTypes.string,
    status: PropTypes.string,
    statusBorderColor: PropTypes.string,
    className: PropTypes.string,
  }

  static defaultProps = {
    theme: { classes: {} },
    className: undefined,
    statusBorderColor: undefined,
    status: undefined,
    avatar: defaultAvatar,
  }

  render() {
    const {
      name,
      avatar,
      status,
      statusBorderColor,
      classes,
      theme,
      className,
    } = this.props

    return (
      <span
        className={cn(classes.avatarName, theme.classes.avatarName, className)}
      >
        <Avatar
          src={avatar}
          className={cn(classes.avatar, theme.classes.avatar)}
        >
          {status && (
            <Status
              classes={classes}
              status={status}
              borderColor={statusBorderColor}
            />
          )}
        </Avatar>
        <span className={cn(classes.name, theme.classes.name)}>{name}</span>
      </span>
    )
  }
}

export default injectSheet(style)(Username)
