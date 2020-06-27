import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'
import { white } from 'grape-theme/dist/base-colors'
import Icon from 'grape-web/lib/svg-icons/Icon'
import cn from 'classnames'

import { defaultAvatar } from '../../../constants/images'
import Avatar from '../avatar/Avatar'
import userTheme from './userTheme'

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

class UserName extends PureComponent {
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
          type="image"
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
        {status === 'inCall' && (
          <Icon name="camera" className={classes.camera} />
        )}
      </span>
    )
  }
}

export default injectSheet(userTheme)(UserName)
