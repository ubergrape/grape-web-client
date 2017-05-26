import PropTypes from 'prop-types'
import React from 'react'
import capitalize from 'lodash/string/capitalize'
import injectSheet from 'grape-web/lib/jss'
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
      }}
    />
  )
}

Private.propTypes = {
  theme: PropTypes.object.isRequired
}

const defaultRoomIconTheme = {
  statusSize: 14,
  statusBorderWidth: 1,
  statusBorderColor: white,
  size: 32,
  color: white,
  backgroundColor: colors[0]
}

function RoomIcon(props) {
  const {
    name, sheet, theme, className,
    isPrivate, showPrivateStatus
  } = props

  const roomIconTheme = {...defaultRoomIconTheme, ...theme}
  const {color, backgroundColor} = roomIconTheme

  const src = getColoredIcon({name: `room${capitalize(name)}`, color})

  const privateTheme = {
    classes: sheet.classes,
    size: roomIconTheme.statusSize,
    borderWidth: roomIconTheme.statusBorderWidth,
    borderColor: roomIconTheme.statusBorderColor
  }

  return (
    <Avatar
      src={src}
      className={className}
      style={{
        backgroundColor,
        width: roomIconTheme.size,
        height: roomIconTheme.size
      }}
    >
      {isPrivate && showPrivateStatus &&
        <Private
          {...props}
          theme={privateTheme}
        />
      }
    </Avatar>
  )
}

export default injectSheet(style)(RoomIcon)

RoomIcon.propTypes = {
  sheet: PropTypes.object.isRequired,
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
