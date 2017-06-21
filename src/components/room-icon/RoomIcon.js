import PropTypes from 'prop-types'
import React from 'react'
import capitalize from 'lodash/string/capitalize'
import injectSheet from 'grape-web/lib/jss'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import {white, grayBlueDark} from 'grape-theme/dist/base-colors'
import {colors} from 'grape-theme/dist/room-settings'
import {icon as iconSize} from 'grape-theme/dist/sizes'

import {defaultRoomIconSlug} from '../../constants/images'
import Avatar from '../avatar/Avatar'

const StatusIcon = ({classes, borderWidth, borderColor, size}) => (
  <i
    className={classes.lock}
    style={{
      borderColor,
      borderWidth,
      width: size,
      height: size,
      right: -borderWidth,
      bottom: -borderWidth
    }}
  />
)

const defaultRoomIconTheme = {
  statusSize: 14,
  statusBorderWidth: 1,
  statusBorderColor: white,
  size: iconSize.l,
  color: white,
  backgroundColor: colors[0]
}

function RoomIcon(props) {
  const {
    name, classes, theme: userTheme, className,
    isPrivate, showPrivateStatus
  } = props

  const {
    color, backgroundColor,
    size,
    statusSize, statusBorderWidth, statusBorderColor
  } = {...defaultRoomIconTheme, ...userTheme}

  const src = getColoredIcon({name: `room${capitalize(name)}`, color})

  return (
    <Avatar
      src={src}
      className={className}
      style={{
        backgroundColor,
        width: size,
        height: size
      }}
    >
      {isPrivate && showPrivateStatus &&
        <StatusIcon
          classes={classes}
          size={statusSize}
          borderWidth={statusBorderWidth}
          borderColor={statusBorderColor}
        />
      }
    </Avatar>
  )
}

export default injectSheet({
  lock: {
    position: 'absolute',
    overflow: 'hidden',
    border: {
      style: 'solid',
      radius: '50%'
    },
    background: {
      image: `url(${getColoredIcon({name: 'lock', color: white})})`,
      color: grayBlueDark,
      position: ['50%', '50%'],
      repeat: 'no-repeat',
      size: '70%'
    }
  }
})(RoomIcon)

RoomIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.shape({
    statusSize: PropTypes.number,
    statusBorderWidth: PropTypes.number,
    statusBorderColor: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    backgroundColor: PropTypes.string
  }).isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  isPrivate: PropTypes.bool.isRequired,
  showPrivateStatus: PropTypes.bool.isRequired
}

RoomIcon.defaultProps = {
  name: defaultRoomIconSlug,
  className: '',
  isPrivate: false,
  showPrivateStatus: false
}
