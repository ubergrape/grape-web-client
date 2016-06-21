import React, {PropTypes} from 'react'
import capitalize from 'lodash/string/capitalize'
import {useSheet} from 'grape-web/lib/jss'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import {white} from 'grape-theme/dist/base-colors'
import {colors} from 'grape-theme/dist/room-settings'

import {defaultRoomIconSlug} from '../../constants/images'
import Avatar from '../avatar/Avatar'
import style from './style'

function Private({theme}) {
  const {
    classes,
    borderWidth,
    borderColor,
    borderWidth: right,
    borderWidth: bottom,
    size: width, size: height
  } = theme

  return (
    <i
      className={classes.lock}
      style={{
        borderColor,
        borderWidth,
        width,
        height,
        right: -right,
        bottom: -bottom
      }} />
  )
}

Private.propTypes = {
  theme: PropTypes.object.isRequired
}

function RoomIcon(props) {
  const {
    name, size, color, backgroundColor, sheet,
    statusSize, statusBorderWidth, statusBorderColor,
    className, isPrivate, showPrivateStatus
  } = props
  const src = getColoredIcon({name: `room${capitalize(name)}`, color: color})

  const theme = {
    classes: sheet.classes,
    size: statusSize,
    borderWidth: statusBorderWidth,
    borderColor: statusBorderColor
  }
  return (
    <Avatar
      src={src}
      className={className}
      style={{
        backgroundColor,
        width: size,
        height: size
      }}>
      {isPrivate && showPrivateStatus &&
        <Private
          {...props}
          theme={theme} />
      }
    </Avatar>
  )
}

export default useSheet(RoomIcon, style)

RoomIcon.propTypes = {
  sheet: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  isPrivate: PropTypes.bool.isRequired,
  showPrivateStatus: PropTypes.bool.isRequired,
  statusSize: PropTypes.number.isRequired,
  statusBorderWidth: PropTypes.number.isRequired,
  statusBorderColor: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

RoomIcon.defaultProps = {
  name: defaultRoomIconSlug,
  color: white,
  className: '',
  backgroundColor: colors[0],
  isPrivate: false,
  showPrivateStatus: false,
  statusSize: 14,
  statusBorderWidth: 1,
  statusBorderColor: white
}
