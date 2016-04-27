import React, {PropTypes} from 'react'
import capitalize from 'lodash/string/capitalize'

import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import {white} from 'grape-theme/dist/base-colors'
import colors from 'grape-theme/dist/room-icon-color-palette'

import {defaultRoomIconSlug} from '../../constants/images'
import Avatar from '../avatar/Avatar'

export default function RoomIcon({name, size, color, backgroundColor, className}) {
  const src = getColoredIcon({name: `room${capitalize(name)}`, color: color})
  return (
    <Avatar
      src={src}
      className={className}
      style={{
        backgroundColor,
        width: size,
        height: size
      }} />
  )
}

RoomIcon.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

RoomIcon.defaultProps = {
  name: defaultRoomIconSlug,
  color: white,
  backgroundColor: colors[0]
}
