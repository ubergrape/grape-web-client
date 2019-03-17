import PropTypes from 'prop-types'
import React from 'react'
import capitalize from 'lodash/capitalize'
import noop from 'lodash/noop'
import injectSheet from 'grape-web/lib/jss'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import Icon from 'grape-web/lib/svg-icons/Icon'
import { white, grayBlueDark } from 'grape-theme/dist/base-colors'
import { colors } from 'grape-theme/dist/room-settings'
import { icon as iconSize } from 'grape-theme/dist/sizes'

import { defaultIconSlug } from '../../constants/channel'
import Avatar from '../avatar/Avatar'

const StatusIcon = ({ classes, borderWidth, borderColor, size }) => (
  <i
    className={classes.lock}
    style={{
      borderColor,
      borderWidth,
      width: size,
      height: size,
      right: -borderWidth,
      bottom: -borderWidth,
    }}
  />
)

const defaultRoomIconTheme = {
  statusSize: 14,
  statusBorderWidth: 1,
  statusBorderColor: white,
  size: iconSize.xl,
  color: white,
  backgroundColor: colors[0],
}

function RoomIcon(props) {
  const {
    classes,
    theme: userTheme,
    className,
    isPrivate,
    showPrivateStatus,
    onClick,
  } = props

  let { name } = props

  const {
    color,
    backgroundColor,
    size,
    statusSize,
    statusBorderWidth,
    statusBorderColor,
  } = { ...defaultRoomIconTheme, ...userTheme }

  if (name === null || !name) {
    name = defaultIconSlug
  }

  return (
    <Avatar
      className={className}
      onClick={onClick}
      style={{
        color,
        backgroundColor,
        width: size,
        height: size,
      }}
    >
      <Icon name={`room${capitalize(name)}`} className={classes.icon} />
      {isPrivate &&
        showPrivateStatus && (
          <StatusIcon
            classes={classes}
            size={statusSize}
            borderWidth={statusBorderWidth}
            borderColor={statusBorderColor}
          />
        )}
    </Avatar>
  )
}

export default injectSheet({
  lock: {
    position: 'absolute',
    overflow: 'hidden',
    border: {
      style: 'solid',
      radius: '50%',
    },
    background: {
      image: `url(${getColoredIcon({ name: 'lock', color: white })})`,
      color: grayBlueDark,
      position: ['50%', '50%'],
      repeat: 'no-repeat',
      size: '50%',
    },
  },
  icon: {
    isolate: false,
    width: '100%',
    height: '100%',
  },
})(RoomIcon)

RoomIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.shape({
    statusSize: PropTypes.number,
    statusBorderWidth: PropTypes.number,
    statusBorderColor: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
  }).isRequired,
  name: PropTypes.string,
  className: PropTypes.string.isRequired,
  isPrivate: PropTypes.bool.isRequired,
  showPrivateStatus: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
}

RoomIcon.defaultProps = {
  name: null,
  className: '',
  isPrivate: false,
  showPrivateStatus: false,
  onClick: noop,
}
