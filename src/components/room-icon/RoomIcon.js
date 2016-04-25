import React, {PropTypes} from 'react'
import getColoredIcon from 'grape-web/lib/svg-icons/getColored'
import {white} from 'grape-theme/dist/base-colors'

import Avatar from '../avatar/Avatar'

export default function RoomIcon({name, size, color: backgroundColor}) {
  const src = getColoredIcon({name, color: white})
  return <Avatar src={src} style={{backgroundColor, width: size, height: size}} />
}

RoomIcon.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

RoomIcon.defaultProps = {
  name: 'roomBulb'
}
