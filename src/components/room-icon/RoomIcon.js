import React, {PropTypes} from 'react'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import {white} from 'grape-theme/dist/base-colors'
import colors from 'grape-theme/dist/room-icon-color-palette'

import Avatar from '../avatar/Avatar'

export default function RoomIcon({name, size, color, backgroundColor}) {
  const src = getColoredIcon({name, color: color})
  return <Avatar src={src} style={{backgroundColor, width: size, height: size}} />
}

RoomIcon.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

RoomIcon.defaultProps = {
  name: 'roomBulb',
  color: white,
  backgroundColor: colors[0]
}
