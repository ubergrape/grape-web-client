import React, {PropTypes} from 'react'
import capitalize from 'lodash/string/capitalize'
import {useSheet} from 'grape-web/lib/jss'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import {white} from 'grape-theme/dist/base-colors'
import {colors} from 'grape-theme/dist/room-settings'

import {defaultRoomIconSlug} from '../../constants/images'
import Avatar from '../avatar/Avatar'
import style from './style'

function Private(props) {
  const {
    theme, borderWidth,
    borderWidth: right,
    borderWidth: bottom,
    statusBorderColor: borderColor,
    size: width, size: height
  } = props
  const {classes} = theme
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
  theme: PropTypes.object.isRequired,
  size: PropTypes.number.isRequired,
  borderWidth: PropTypes.number.isRequired,
  statusBorderColor: PropTypes.string.isRequired
}

Private.defaultProps = {
  size: 14,
  borderWidth: 1,
  statusBorderColor: white
}

function RoomIcon(props) {
  const {
    name, size, color, backgroundColor, sheet,
    className, isPrivate, showPrivateStatus
  } = props
  const src = getColoredIcon({name: `room${capitalize(name)}`, color: color})
  const{classes} = sheet
  return (
    <Avatar
      src={src}
      className={className}
      style={{
        backgroundColor,
        width: size,
        height: size
      }}>
      {isPrivate && showPrivateStatus && <Private {...props} theme={{classes}} />}
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
  showPrivateStatus: false
}
